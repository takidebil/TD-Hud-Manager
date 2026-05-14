import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import { getHudsDir, getBuiltinHudDir } from '../../paths'

/**
 * Middleware that injects the VDO.ninja monkey-patch script into any HUD index.html.
 */
export function hudInjectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const url = req.url

  // Only process requests for index.html or the HUD root (which serves index.html)
  if (!url.startsWith('/huds/')) {
    return next()
  }

  // If it's a directory request or index.html
  if (url.endsWith('/') || url.endsWith('/index.html') || !url.split('/').pop()?.includes('.')) {
    const hudIdMatch = url.match(/^\/huds\/([^/]+)/)
    if (!hudIdMatch) return next()

    const hudId = hudIdMatch[1]
    const hudDir = hudId === 'default' ? getBuiltinHudDir() : path.join(getHudsDir(), hudId)
    const indexPath = path.join(hudDir, 'index.html')

    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf-8')

      // VDO.ninja injection script
      const script = `
    <script>
      (function() {
        async function getPlayerData() {
          if (window._playerData) return window._playerData;
          try {
            const res = await fetch('/api/players');
            window._playerData = await res.json();
            return window._playerData;
          } catch (e) {
            return [];
          }
        }
        function createNinjaIFrame(vdoId) {
          const iframe = document.createElement('iframe');
          iframe.src = 'https://vdo.ninja/?view=' + vdoId + '&autoplay&mute&header=0&cc=0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.pointerEvents = 'none';
          iframe.className = 'vdo-ninja-frame';
          iframe.setAttribute('allow', 'autoplay; camera; microphone; fullscreen; picture-in-picture');
          return iframe;
        }
        async function handleImg(img) {
          if (img.tagName !== 'IMG') return;
          const players = await getPlayerData();
          const player = players.find(p => p.avatar && img.src.includes(p.avatar));
          const parent = img.parentElement;
          if (!parent) return;
          const existingFrame = parent.querySelector('.vdo-ninja-frame');
          if (player && player.extra && player.extra.vdo_ninja_id) {
            const vdoId = player.extra.vdo_ninja_id;
            if (existingFrame) {
               if (existingFrame.dataset.vdoId === vdoId) return;
               existingFrame.remove();
            }
            if (getComputedStyle(parent).position === 'static') {
              parent.style.position = 'relative';
            }
            img.style.opacity = '0';
            const iframe = createNinjaIFrame(vdoId);
            iframe.dataset.vdoId = vdoId;
            parent.appendChild(iframe);
          } else {
            if (existingFrame) {
              existingFrame.remove();
              img.style.opacity = '1';
            }
          }
        }
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') handleImg(node);
                else if (node.querySelectorAll) node.querySelectorAll('img').forEach(handleImg);
              });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
              handleImg(mutation.target);
            }
          }
        });
        observer.observe(document.body, { 
          childList: true, 
          subtree: true, 
          attributes: true, 
          attributeFilter: ['src'] 
        });
        document.querySelectorAll('img').forEach(handleImg);
      })();
    </script>
      `

      // Inject before </body>
      if (content.includes('</body>')) {
        content = content.replace('</body>', script + '</body>')
        res.setHeader('Content-Type', 'text/html')
        return res.send(content)
      }
    }
  }

  next()
}

(function() {
  // --- Configuration ---
  const SELECTORS = {
    csvFileNamePattern: '${channelName}-Video-list.csv',
    channelName: 'h1.dynamic-text-view-model-wiz__h1 span',
    videoItem: 'ytd-rich-item-renderer',
    titleLink: '#video-title-link',
    thumbnailImg: 'ytd-thumbnail-overlay img, ytd-thumbnail img, img',
    durationSpan: 'ytd-thumbnail-overlay-time-status-renderer span',
    metadataLine: '#metadata-line',
  };

  // --- UI Creation ---
  function createUI() {
    if (document.getElementById('yt-export-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'yt-export-panel';
    panel.style.position = 'fixed';
    panel.style.top = '15px';
    panel.style.right = '15px';
    panel.style.width = '350px';
    panel.style.backgroundColor = '#fff';
    panel.style.border = '1px solid #ddd';
    panel.style.padding = '20px 25px 25px 25px';
    panel.style.zIndex = 100000;
    panel.style.fontFamily = `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`;
    panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    panel.style.borderRadius = '12px';
    panel.style.userSelect = 'none';
    panel.style.boxSizing = 'border-box';
    panel.style.color = '#333';

    // Close button (small "X" top-right corner)
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeExportBtn';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close panel';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.lineHeight = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#888';
    closeBtn.style.padding = '0';
    closeBtn.style.userSelect = 'none';
    closeBtn.style.fontWeight = '700';
    closeBtn.style.transition = 'color 0.25s ease, transform 0.25s ease';

    // Hover effect on close button: red color and slight scale up
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.color = '#e03e3e';
      closeBtn.style.transform = 'scale(1.15)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.color = '#888';
      closeBtn.style.transform = 'scale(1)';
    });

    closeBtn.addEventListener('click', () => {
      panel.remove();
    });

    panel.appendChild(closeBtn);

    panel.innerHTML += `
      <h3 style="
        margin-top: 0; 
        margin-bottom: 14px; 
        font-weight: 700; 
        font-size: 22px; 
        color: #222;
        user-select: none;
      ">YouTube Exporter</h3>
      <label for="csvFileName" style="
        font-weight: 600; 
        display: block; 
        margin-bottom: 6px;
        color: #555;
      ">CSV filename pattern:</label>
      <input type="text" id="csvFileName" style="
        width: 100%; 
        box-sizing: border-box; 
        padding: 8px 12px; 
        margin-bottom: 16px;
        font-size: 14px;
        border: 1.5px solid #ccc; 
        border-radius: 8px;
        transition: border-color 0.3s ease;
        outline-offset: 2px;
      " value="${SELECTORS.csvFileNamePattern}" />
      <button id="startExportBtn" style="
        width: 100%; 
        padding: 12px; 
        font-size: 17px; 
        cursor: pointer;
        background-color: #0078d7; 
        color: white; 
        border: none; 
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,120,215,0.4);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        font-weight: 600;
        user-select: none;
      ">Start Export</button>
      <div style="margin-top: 18px;">
        <div id="progressBarContainer" style="
          width: 100%; 
          height: 22px; 
          background: #f0f0f0; 
          border-radius: 12px; 
          overflow: hidden; 
          border: 1px solid #ccc;
          box-shadow: inset 0 1px 3px rgb(255 255 255 / 0.6);
        ">
          <div id="progressBar" style="
            height: 100%; 
            width: 0%; 
            background: #0078d7; 
            transition: width 0.3s ease;
            border-radius: 12px 0 0 12px;
          "></div>
        </div>
      </div>
      <div id="logArea" style="
        margin-top: 14px; 
        height: 140px; 
        overflow-y: auto; 
        background: #fafafa; 
        border: 1px solid #ddd; 
        padding: 10px; 
        font-size: 13px; 
        color: #444;
        font-family: monospace;
        white-space: pre-wrap;
        border-radius: 8px;
        box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.05);
      "></div>
    `;

    // Hover effect for start button
    const startBtn = panel.querySelector('#startExportBtn');
    startBtn.addEventListener('mouseenter', () => {
      startBtn.style.backgroundColor = '#005ea2';
      startBtn.style.boxShadow = '0 7px 20px rgba(0,94,162,0.6)';
    });
    startBtn.addEventListener('mouseleave', () => {
      startBtn.style.backgroundColor = '#0078d7';
      startBtn.style.boxShadow = '0 5px 15px rgba(0,120,215,0.4)';
    });

    startBtn.addEventListener('click', () => {
      const input = document.getElementById('csvFileName');
      SELECTORS.csvFileNamePattern = input.value.trim() || '${channelName}-Video-list.csv';
      appendLog('Export started...');
      updateProgress(10); // Immediately set progress to 10% on start
      scrollAndWaitToLoadAllVideos();
    });

    document.body.appendChild(panel);
  }

  // --- Logging ---
  function appendLog(msg, type = 'info') {
    const logArea = document.getElementById('logArea');
    if (!logArea) return;
    const time = new Date().toLocaleTimeString();
    let color = '#333';
    if (type === 'warn') color = '#d97706';      // amber/orange
    if (type === 'error') color = '#dc2626';     // red
    if (type === 'info') color = '#2563eb';      // blue

    const logLine = document.createElement('div');
    logLine.style.color = color;
    logLine.textContent = `[${time}] ${msg}`;
    logArea.appendChild(logLine);
    logArea.scrollTop = logArea.scrollHeight;
  }

  // --- Progress bar update ---
  let currentProgress = 0;
  function updateProgress(percent) {
    if (percent < currentProgress) return;
    currentProgress = percent;
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    progressBar.style.width = `${percent}%`;
  }

  // --- Duration converter ---
  function durationToMinutes(durationStr) {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.some(isNaN)) {
      appendLog(`Invalid duration format encountered: "${durationStr}"`, 'warn');
      return 0;
    }
    let totalSeconds = 0;
    if (parts.length === 3) {
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      totalSeconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      totalSeconds = parts[0];
    } else {
      appendLog(`Unexpected duration format: "${durationStr}"`, 'warn');
      return 0;
    }
    return totalSeconds / 60;
  }

  // --- Export function ---
  function exportYoutubeDataToCsv() {
    try {
      let channelNameElement = document.querySelector(SELECTORS.channelName);
      let channelName = channelNameElement?.textContent.trim() || '';

      if (!channelName) {
        const fullTitle = document.title || 'youtube_channel';
        const rawChannelName = fullTitle.split(' - YouTube')[0] || 'youtube_channel';
        channelName = rawChannelName.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'youtube_channel';
        appendLog('Channel name not found in selector, falling back to page title: ' + channelName, 'warn');
      } else {
        channelName = channelName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim();
      }

      const videos = Array.from(document.querySelectorAll(SELECTORS.videoItem));
      if (videos.length === 0) {
        appendLog('No videos found on the page.', 'warn');
        return;
      }
      appendLog(`Found ${videos.length} video items.`);

      let data = videos.map((video, index) => {
        try {
          const titleEl = video.querySelector(SELECTORS.titleLink);
          if (!titleEl) {
            appendLog(`Video #${index + 1} missing title element.`, 'warn');
          }
          const title = titleEl?.textContent.trim() || '';
          const url = titleEl?.href || '';

          const thumbnailImg = video.querySelector(SELECTORS.thumbnailImg);
          const thumbnail = thumbnailImg?.src || '';

          const durationEl = video.querySelector(SELECTORS.durationSpan);
          const durationRaw = durationEl?.textContent.trim() || '';
          const duration = durationToMinutes(durationRaw);

          const metadataLine = video.querySelector(SELECTORS.metadataLine);
          let viewsText = '';
          if (metadataLine) {
            viewsText = metadataLine.querySelector('span')?.textContent.trim() || '';
          }

          const datePublished = metadataLine ? metadataLine.querySelectorAll('span')[1]?.textContent.trim() || '' : '';

          return { title, url, thumbnail, duration, datePublished, views: viewsText, channel: channelName };
        } catch (e) {
          appendLog(`Error parsing video #${index + 1}: ${e.message}`, 'error');
          return null;
        }
      }).filter(x => x !== null);

      data = data.reverse();
      data = data.map((item, index) => ({
        number: index + 1,
        ...item,
      }));
      data = data.reverse();

      const keys = ['number', 'title', 'link', 'channel', 'duration', 'published', 'views', 'thumbnail'];
      const csvRows = [];
      csvRows.push(keys.join(','));

      for (const row of data) {
        const values = keys.map(k => {
          let val = '';
          if (k === 'link') val = row.url || '';
          else if (k === 'published') val = row.datePublished || '';
          else if (k === 'duration') val = row.duration.toFixed(2);
          else val = row[k] ?? '';

          if (typeof val === 'string') {
            val = val.replace(/"/g, '""');
          }
          return `"${val}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvString = csvRows.join('\n');
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });

      const fileName = SELECTORS.csvFileNamePattern.replace('${channelName}', channelName);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      appendLog(`CSV export complete: ${fileName}`, 'info');
      updateProgress(100);
    } catch (err) {
      appendLog('Unexpected error during export: ' + err.message, 'error');
      updateProgress(0);
    }
  }

  // --- Scroll and wait function ---
  function scrollAndWaitToLoadAllVideos() {
    let lastVideoCount = 0;
    let stableCountTimes = 0;
    const maxStableTimes = 5;

    const interval = setInterval(() => {
      window.scrollBy(0, 1000);

      const videos = document.querySelectorAll(SELECTORS.videoItem);
      const currentCount = videos.length;

      if (currentCount === lastVideoCount) {
        stableCountTimes++;
      } else {
        stableCountTimes = 0;
        lastVideoCount = currentCount;
      }

      const progressPercent = 10 + Math.min(85, (stableCountTimes / maxStableTimes) * 85);
      updateProgress(progressPercent);

      appendLog(`Videos loaded so far: ${currentCount}`);

      if (stableCountTimes >= maxStableTimes) {
        clearInterval(interval);
        appendLog(`Scrolling complete. Total videos loaded: ${currentCount}. Starting export...`);
        exportYoutubeDataToCsv();
      }
    }, 1000);
  }

  // --- Initialize ---
  createUI();
  appendLog('UI loaded. Ready to start export.');
})();

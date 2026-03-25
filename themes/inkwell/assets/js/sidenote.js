// 侧边注释定位和交互
(function () {
  "use strict";

  function isMobile() {
    return window.innerWidth <= 900;
  }

  // ========== 桌面端:侧边注释定位 ==========
  function positionSidenotes() {
    if (isMobile()) return;

    const refs = document.querySelectorAll(".sidenote-ref");
    const main = document.querySelector("main");
    const container = document.querySelector(".sidenotes-container");

    if (!refs.length || !main || !container) return;

    // 使用 requestAnimationFrame 确保在渲染后执行
    requestAnimationFrame(() => {
      const mainRect = main.getBoundingClientRect();

      refs.forEach((ref) => {
        const num = ref.dataset.ref;
        const note = document.getElementById(`sidenote-${num}`);
        if (!note) return;

        const refRect = ref.getBoundingClientRect();

        // 计算相对位置
        const relativeTop = refRect.top - mainRect.top;

        note.style.top = `${relativeTop}px`;
      });

      resolveOverlaps();
      syncTocFade();
    });
  }

  function resolveOverlaps() {
    const notes = Array.from(document.querySelectorAll(".sidenote"));
    if (notes.length < 2) return;

    // 按当前位置排序
    notes.sort((a, b) => {
      return parseFloat(a.style.top) - parseFloat(b.style.top);
    });

    // 检查并调整重叠
    for (let i = 1; i < notes.length; i++) {
      const curr = notes[i];
      const prev = notes[i - 1];

      const currTop = parseFloat(curr.style.top);
      const prevBottom = parseFloat(prev.style.top) + prev.offsetHeight + 20;

      if (currTop < prevBottom) {
        curr.style.top = `${prevBottom}px`;
      }
    }
  }

  // ========== 桌面端: TOC 动态避让 ==========
  function syncTocFade() {
    if (isMobile()) return;

    const sidenotes = document.querySelectorAll(".sidenote");
    const tocLinks = document.querySelectorAll(".toc a");

    if (!sidenotes.length || !tocLinks.length) return;

    const noteRects = Array.from(sidenotes).map((n) => n.getBoundingClientRect());

    tocLinks.forEach((link) => {
      const linkRect = link.getBoundingClientRect();
      const overlaps = noteRects.some(
        (r) => r.bottom > linkRect.top + 2 && r.top < linkRect.bottom - 2
      );
      link.style.opacity = overlaps ? "0" : "";
    });
  }

  // ========== 桌面端:点击高亮 ==========
  function setupDesktopClickHandlers() {
    if (isMobile()) return;

    const refs = document.querySelectorAll(".sidenote-ref");
    const notes = document.querySelectorAll(".sidenote");

    refs.forEach((ref) => {
      ref.addEventListener("click", function (e) {
        e.preventDefault();
        const num = this.dataset.ref;
        const targetNote = document.getElementById(`sidenote-${num}`);

        if (targetNote) {
          // 移除其他高亮
          notes.forEach((n) => n.classList.remove("highlight"));
          refs.forEach((r) => r.classList.remove("active"));

          // 添加高亮
          targetNote.classList.add("highlight");
          this.classList.add("active");

          // 滚动到可视区域
          targetNote.scrollIntoView({ behavior: "smooth", block: "center" });

          // 3秒后移除高亮
          setTimeout(() => {
            targetNote.classList.remove("highlight");
            this.classList.remove("active");
          }, 3000);
        }
      });
    });
  }

  // ========== 移动端:Tooltip 浮窗 ==========
  let currentTooltip = null;

  function setupMobileTooltip() {
    if (!isMobile()) return;

    const refs = document.querySelectorAll(".sidenote-ref");

    refs.forEach((ref) => {
      // 移除旧的监听器(如果有)
      ref.replaceWith(ref.cloneNode(true));
    });

    // 重新获取并添加监听器
    document.querySelectorAll(".sidenote-ref").forEach((ref) => {
      ref.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const num = this.dataset.ref;
        const note = document.getElementById(`sidenote-${num}`);
        if (!note) return;

        // 如果已有 tooltip,先移除
        if (currentTooltip) {
          currentTooltip.remove();
          currentTooltip = null;
        }

        // 创建 tooltip
        const tooltip = document.createElement("div");
        tooltip.className = "sidenote-tooltip show";
        tooltip.innerHTML = note.innerHTML;
        document.body.appendChild(tooltip);
        currentTooltip = tooltip;

        tooltip.addEventListener("click", function (e) {
          e.stopPropagation();
        });

        // 计算位置
        const rect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const padding = 10; // 距离边缘的最小间距

        let top, left;

        // 1. 垂直位置:优先下方,不够则上方
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (
          spaceBelow >= tooltipRect.height + padding ||
          spaceBelow >= spaceAbove
        ) {
          // 显示在下方
          top = rect.bottom + scrollY + padding;
        } else {
          // 显示在上方
          top = rect.top + scrollY - tooltipRect.height - padding;
        }

        // 确保不超出顶部和底部
        top = Math.max(scrollY + padding, top);
        top = Math.min(
          scrollY + viewportHeight - tooltipRect.height - padding,
          top,
        );

        // 2. 水平位置:尽量居中对齐标记,但不超出边界
        const refCenter = rect.left + rect.width / 2;
        left = refCenter - tooltipRect.width / 2 + scrollX;

        // 确保不超出左右边界
        if (left < scrollX + padding) {
          left = scrollX + padding;
        } else if (
          left + tooltipRect.width >
          scrollX + viewportWidth - padding
        ) {
          left = scrollX + viewportWidth - tooltipRect.width - padding;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      });
    });

    // 点击其他地方关闭 tooltip
    document.addEventListener("click", closeTooltip);

    // 滚动时关闭 tooltip
    let scrollTimer;
    window.addEventListener("scroll", function () {
      if (currentTooltip) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(closeTooltip, 100);
      }
    });
  }

  function closeTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }

  // ========== 初始化 ==========
  function init() {
    if (isMobile()) {
      // 移动端:设置 tooltip
      setupMobileTooltip();
    } else {
      // 桌面端:定位侧边注释
      positionSidenotes();
      setupDesktopClickHandlers();
    }
  }

  // 响应式处理
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // 清理可能存在的 tooltip
      closeTooltip();
      // 重新初始化
      init();
    }, 250);
  });

  // 滚动时同步 TOC 淡出
  let tocFadeRaf;
  window.addEventListener("scroll", function () {
    if (tocFadeRaf) cancelAnimationFrame(tocFadeRaf);
    tocFadeRaf = requestAnimationFrame(syncTocFade);
  });

  // 页面加载完成后执行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

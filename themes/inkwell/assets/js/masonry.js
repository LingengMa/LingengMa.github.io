if (!document.getElementById('imageModal')) {
  // 只有当不存在时才添加
  document.body.insertAdjacentHTML('beforeend', `
    <div id="imageModal" class="image-modal">
      <div class="image-modal-content" id="image-modal-content">
        <img id="modalImage" class="image-modal-img">
        <div id="modalCaption" class="image-modal-caption"></div>
      </div>
    </div>
  `);
}

function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');

    modal.style.display = 'block';
    modalImg.src = imageSrc;
    modalCaption.textContent = caption;

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';

    // 恢复页面滚动
    document.body.style.overflow = 'auto';
}

// 改为事件监听的方式
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('masonry-image')) {
        const imageSrc = event.target.src;
        const caption = event.target.nextElementSibling ? event.target.nextElementSibling.textContent : '';
        openImageModal(imageSrc, caption);
    }
});

// 点击模态框背景关闭
document.addEventListener('click', function(event) {
    console.log(event.target.id);
    if (event.target.id === 'image-modal-content') {
        closeImageModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});


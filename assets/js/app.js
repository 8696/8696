//

//

//

function Http() {
  let xhr = new XMLHttpRequest();
  this.get = function (url) {
    return new Promise((resolve, reject) => {
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.responseText);
        } else if (xhr.readyState === 4) {
          reject();
        }
      };
      xhr.send();
    });
  };
}

document.body.innerHTML = `
<div class="sidebar">
  <section class="section">
      <div class="loading">loading...</div>
  </section>
</div>
<div class="content">
  <section class="section">
    <div class="loading">loading...</div>
  </section>
</div>
<div class="fixed">
  <div class="icon"><img class="toggle-view-mode" src="/assets/images/yj.png" alt=""></div>
  <div class="icon"><img class="toggle-sidebar" src="/assets/images/menu.png" alt=""></div>
  <div class="icon"><img class="go-top" src="/assets/images/go-top.png" alt=""></div>
</div>
`;

function setLikeNewTab() {
  let links = Array.from(document.querySelectorAll('a'));
  for (let i = 0; i < links.length; i++) {
    if (/^http/.test(links[i].getAttribute('href'))) {
      links[i].setAttribute('target', '_blank');
    }
  }
}


// 加载 sidebar
function getSidebar() {

  new Http().get('/layout/sidebar.md')
    .then(md => {
      document.querySelector('.sidebar .section').innerHTML = marked(md);

      let sidebarLinks = document.querySelectorAll('a');
      sidebarLinks = Array.from(sidebarLinks);
      let hash = decodeURI(window.location.hash);
      for (let i = 0; i < sidebarLinks.length; i++) {
        if (decodeURI(sidebarLinks[i].getAttribute('href')) === hash) {
          if (sidebarLinks[i].offsetTop > window.innerHeight) {
            document.querySelector('.section').scrollTo({
              top: sidebarLinks[i].offsetTop - 10
            });
          }
          break;
        }
      }
      setLikeNewTab();

    })
    .catch(() => {
      setTimeout(() => {
        getSidebar();
      }, 2000);
    });
}

getSidebar();


let cache = new Map();
let timer = 0;

// 加载远程 md
function getRemoteMd(url) {

  clearTimeout(timer);
  return new Promise((resolve, reject) => {
    if (cache.has(url)) {
      return resolve(cache.get(url));
    }
    new Http()
      .get(url)
      .then(md => {
        cache.set(url, md);
        resolve(md);
      })
      .catch(() => {
        timer = setTimeout(() => {
          getRemoteMd(url);
        }, 2000);
      });
  });
}

function padTo(number, length) {
  number = String(number);
  length = String(length).length;
  length = length < 2 ? 2 : length;
  return (Array(length).join(0) + number).slice(-length);
}


let topLineEl = document.createElement('div');
topLineEl.classList.add('top-line');
document.body.appendChild(topLineEl);

function topLine() {
  topLineEl.style.width =
    (document.querySelector('.content ').scrollTop
      /
      (document.querySelector('.content .section').offsetHeight
        -
        window.innerHeight) * 100 + '%'
    );
}

document.querySelector('.content').addEventListener('scroll', topLine);

topLine();

// url change 监听函数
function hashChangeListener() {
  let url = '', hash = location.hash;
  if (hash === '') {
    hash = url = '#README.md';
  } else {
    url = hash;
  }
  url = url.replace('#', '');


  getRemoteMd(url).then(md => {

    document.querySelector('.content .section').innerHTML = marked(md);
    Array.from(document.getElementsByTagName('pre'))
      .forEach(el => {
        el.innerHTML =
          '<div ><span class="line">' + el.innerHTML
            .replace(/\n/g, '\n</span><span class="line">')
          + '\n</span></div>';
        // el.innerHTML =
        //   '<ul><li>' + el.innerHTML
        //     .replace(/\n/g, '\n</li><li>')
        //   + '\n</li></ul>';
        hljs.highlightBlock(el);
        let lines = Array.from(el.querySelectorAll('.line'));
        lines.forEach((item, index) => {
          item.innerHTML =
            `<span class="line-number">${padTo(index, lines.length)}</span>`
            + '  ' + item.innerHTML;
        });
      });
    //

    setTimeout(() => {
      try {
        let sidebarA = document.querySelector(`.sidebar-active`);
        sidebarA.classList.remove('sidebar-active');
      } catch (e) {
        // console.error(e)
      }
      try {
        let sidebarA = document.querySelector(`a[href="${hash}"]`);
        sidebarA.classList.add('sidebar-active');
      } catch (e) {
        // console.error(e)
      }


    }, 10);
    document.querySelector('.content').scrollTo(0, 0);


    if (window.innerWidth < 600) {
      toggleSidebar.hide();
    }
    setLikeNewTab();

    // 设置 Title
    let mdTitle = url.replace('.md', '').split('/').pop();

    document.title = decodeURI(mdTitle + ' - 8696.icode.link');

    //
  });
}

hashChangeListener();

window.addEventListener('hashchange', hashChangeListener);

// 返回顶部
document.querySelector('.go-top').addEventListener('click', () => {
  document.querySelector('.content').scrollTo(0, 0);
});


let toggleSidebar = (function () {
  let sidebar = document.querySelector('.sidebar');
  return {
    show() {

      document.querySelector('.content').style.width = 'calc(100vw - 240px)';
      sidebar.classList.remove('sidebar-hide');
      sidebar.setAttribute('data-open', '1');
    },
    hide() {
      sidebar.classList.add('sidebar-hide');
      document.querySelector('.content').style.width = '100%';
      sidebar.setAttribute('data-open', '2');
    },
    status() {
      let open = Number(sidebar.getAttribute('data-open')) || 1;
      return open === 1;
    }
  };

}());

// 展开/关闭菜单
document.querySelector('.toggle-sidebar').addEventListener('click', () => {
  toggleSidebar.status() ? toggleSidebar.hide() : toggleSidebar.show();
});
// 移动端默认隐藏菜单
if (window.innerWidth < 600) {
  toggleSidebar.hide();
}

// 切换夜间模式
let viewMode = localStorage.getItem('view-mode') || 1;
viewMode = Number(viewMode);
viewMode = viewMode === 1 ? 2 : 1;

function viewModeChangeListener(event) {
  if (viewMode === 1) {
    event.target.setAttribute('src', '/assets/images/ty.png');
    viewMode = 2;
    document.documentElement.classList.add('black-theme');
  } else {
    event.target.setAttribute('src', '/assets/images/yj.png');
    viewMode = 1;
    document.documentElement.classList.remove('black-theme');
  }
  localStorage.setItem('view-mode', viewMode);
}

document.querySelector('.toggle-view-mode').addEventListener('click', viewModeChangeListener);
viewModeChangeListener({target: document.querySelector('.toggle-view-mode')});



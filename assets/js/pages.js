(() => {
  'use strict';
  // Shared page enhancements; no external dependencies.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-sub-toggle');
    trigger?.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-dropdown.is-open').forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('is-open');
          other.querySelector('.nav-sub-toggle')?.setAttribute('aria-expanded','false');
        }
      });
      dropdown.classList.toggle('is-open', !expanded);
      trigger.setAttribute('aria-expanded', String(!expanded));
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('.nav-sub-toggle')?.setAttribute('aria-expanded','false');
      });
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.nav-dropdown.is-open').forEach(item => {
      item.classList.remove('is-open');
      item.querySelector('.nav-sub-toggle')?.setAttribute('aria-expanded','false');
    });
  });

  document.querySelectorAll('[data-category-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.categoryFilter;
      document.querySelectorAll('[data-category-filter]').forEach(b => {
        const selected = b === button;
        b.classList.toggle('is-selected',selected);
        b.setAttribute('aria-pressed',String(selected));
      });
      document.querySelectorAll('.filter-card').forEach(card => {
        card.hidden = value !== 'all' && card.dataset.category !== value;
      });
    });
  });

  document.querySelectorAll('[data-gallery-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const photos = document.getElementById(button.getAttribute('aria-controls'));
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      button.firstChild.textContent = willOpen ? 'Hide photographs ' : 'View photographs ';
      if (photos) {
        photos.hidden = !willOpen;
        if (willOpen) photos.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      }
    });
  });

  const lightboxButtons = [...document.querySelectorAll('[data-lightbox-src]')];
  if (lightboxButtons.length) {
    const lb = document.createElement('div');
    lb.className = 'rd-lightbox'; lb.hidden = true;
    lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photograph viewer');
    lb.innerHTML = '<button type="button" class="rd-lightbox__close" aria-label="Close photograph">×</button><button type="button" class="rd-lightbox__nav rd-lightbox__prev" aria-label="Previous photograph">←</button><img alt="" /><button type="button" class="rd-lightbox__nav rd-lightbox__next" aria-label="Next photograph">→</button>';
    document.body.append(lb);
    const photo=lb.querySelector('img');
    let items=[],index=0,previous=null;
    const show = (n) => {
      index=(n+items.length)%items.length;
      photo.src=items[index].dataset.lightboxSrc;
      photo.alt=items[index].dataset.lightboxAlt;
    };
    const close=()=>{lb.hidden=true;document.body.style.overflow='';photo.removeAttribute('src');previous?.focus();};
    lightboxButtons.forEach(button=>button.addEventListener('click',()=>{
      previous=button;
      items=[...button.closest('.detail-gallery').querySelectorAll('[data-lightbox-src]')];
      lb.hidden=false;document.body.style.overflow='hidden';show(items.indexOf(button));lb.querySelector('.rd-lightbox__close').focus();
    }));
    lb.querySelector('.rd-lightbox__close').addEventListener('click',close);
    lb.querySelector('.rd-lightbox__prev').addEventListener('click',()=>show(index-1));
    lb.querySelector('.rd-lightbox__next').addEventListener('click',()=>show(index+1));
    lb.addEventListener('click',e=>{if(e.target===lb) close();});
    document.addEventListener('keydown',e=>{
      if(lb.hidden)return;
      if(e.key==='Escape'){e.preventDefault();close();}
      if(e.key==='ArrowRight')show(index+1);
      if(e.key==='ArrowLeft')show(index-1);
      if(e.key==='Tab'){
        const focusables=[...lb.querySelectorAll('button')];
        const pos=focusables.indexOf(document.activeElement);
        if(e.shiftKey&&pos===0){e.preventDefault();focusables.at(-1).focus();}
        else if(!e.shiftKey&&pos===focusables.length-1){e.preventDefault();focusables[0].focus();}
      }
    });
  }

  // Static/Vercel: mailto is explicitly a hand-off to the visitor's email client, not a claimed submission.
  // PHP host: submit to real PHP scripts; to send from Vercel set RD_PHP_API_BASE to your PHP host.
  const isStatic = location.protocol === 'file:' || location.hostname.endsWith('.vercel.app') || ['localhost','127.0.0.1'].includes(location.hostname);
  const apiBase = (window.RD_PHP_API_BASE || '').replace(/\/$/,'');
  async function send(form, type) {
    const note=form.parentElement.querySelector('.form-note') || form.querySelector('.form-note');
    const button=form.querySelector('button[type=submit]');
    const data=new FormData(form);
    if (data.get('website')) return;
    const openEmailApp = () => {
      const email='studio@rddesign.com';
      let subject='',message='';
      if(type==='contact'){
        subject='RD Design — Project enquiry';
        message=`Name: ${data.get('first_name')} ${data.get('last_name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || 'Not provided'}\n\nProject enquiry:\n${data.get('message')}`;
      }else{
        subject='RD Design — Newsletter request';
        message=`Please add this email to studio updates: ${data.get('email')}`;
      }
      if(note) note.textContent='Your email app is opening with a prepared message. Please press Send there to complete the request.';
      window.location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    };
    if (isStatic && !apiBase) { openEmailApp(); return; }
    if(button)button.disabled=true;
    if(note)note.textContent='Sending…';
    try {
      const endpoint=(apiBase ? apiBase+'/' : '') + form.getAttribute('action').replace(/^\//,'');
      const response=await fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      // On static hosts with a custom domain, PHP endpoints may be missing or rewritten as HTML.
      // Never claim successful delivery: hand off to the visitor's email app instead.
      if (!apiBase && (response.status === 404 || !(response.headers.get('content-type') || '').includes('application/json'))) {
        openEmailApp(); return;
      }
      const result=await response.json();
      if(!response.ok || !result.ok) throw new Error(result.message || 'Unable to send the request.');
      if(note)note.textContent=result.message;
      form.reset();
    } catch(err) {
      if(note) note.textContent=`${err.message || 'Unable to connect.'} You can also email studio@rddesign.com directly.`;
    } finally { if(button)button.disabled=false; }
  }
  document.querySelector('[data-contact-form]')?.addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity())send(event.currentTarget,'contact');});
  document.querySelectorAll('[data-newsletter-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity())send(form,'newsletter');}));

  // Reduced motion and non-IntersectionObserver environments: reveal content immediately.
  if(reduced || !('IntersectionObserver' in window)) document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
})();

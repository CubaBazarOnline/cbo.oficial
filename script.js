document.addEventListener('DOMContentLoaded',function(){
document.getElementById('current-year').textContent=new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
anchor.addEventListener('click',function(e){
e.preventDefault();
const targetId=this.getAttribute('href');
const targetElement=document.querySelector(targetId);
if(targetElement){
if('scrollBehavior'in document.documentElement.style){
targetElement.scrollIntoView({behavior:'smooth'});
}else{
const targetPosition=targetElement.getBoundingClientRect().top+window.pageYOffset-80;
window.scrollTo({top:targetPosition,behavior:'auto'});
}
if(history.pushState){history.pushState(null,null,targetId);}else{location.hash=targetId;}
}});});
window.addEventListener('scroll',function(){
const header=document.querySelector('header');
if(header){
if(window.scrollY>100){
header.style.background='rgba(44, 62, 80, 0.95)';
header.style.padding='0.5rem 0';
header.style.boxShadow='0 2px 10px rgba(0, 0, 0, 0.2)';
}else{
header.style.background='var(--primary)';
header.style.padding='1rem 0';
header.style.boxShadow='0 2px 10px rgba(0, 0, 0, 0.1)';
}}});
const contactForm=document.getElementById('contactForm');
if(contactForm){
contactForm.addEventListener('submit',function(e){
e.preventDefault();
const name=document.getElementById('name').value.trim();
const email=document.getElementById('email').value.trim();
const phone=document.getElementById('phone').value.trim();
const service=document.getElementById('service').value;
const message=document.getElementById('message').value.trim();
if(!name||!email||!service||!message){
showNotification('error','Por favor complete todos los campos requeridos');
return;}
if(!validateEmail(email)){
showNotification('error','Por favor ingrese un correo electrónico válido');
return;}
const emailBody=`Nombre: ${name}%0D%0AEmail: ${email}%0D%0ATeléfono: ${phone||'No proporcionado'}%0D%0AServicio de interés: ${service}%0D%0A%0D%0AMensaje:%0D%0A${message}`;
const mailtoLink=`mailto:cubabazaronline@gmail.com?subject=Solicitud de servicio CBO - ${name}&body=${emailBody}`;
window.location.href=mailtoLink;
showNotification('success','Gracias por tu mensaje. Redirigiendo a tu cliente de correo...');
this.reset();});}
if(window.location.hash){
const target=document.querySelector(window.location.hash);
if(target){setTimeout(function(){target.scrollIntoView();},100);}}
function validateEmail(email){
const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(String(email).toLowerCase());}
function showNotification(type,message,duration=5000){
const container=document.getElementById('notification-container');
if(!container)return;
const notification=document.createElement('div');
notification.className=`notification ${type}`;
notification.setAttribute('role','alert');
let icon;
switch(type){
case'success':icon='<i class="fas fa-check-circle" aria-hidden="true"></i>';break;
case'error':icon='<i class="fas fa-exclamation-circle" aria-hidden="true"></i>';break;
case'warning':icon='<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';break;
default:icon='<i class="fas fa-info-circle" aria-hidden="true"></i>';}
notification.innerHTML=`${icon}<span>${message}</span><button class="close-notification" aria-label="Cerrar notificación">&times;</button>`;
container.appendChild(notification);
setTimeout(function(){notification.classList.add('show');},10);
const closeBtn=notification.querySelector('.close-notification');
if(closeBtn){
closeBtn.addEventListener('click',function(){closeNotification(notification);});}
if(duration){setTimeout(function(){closeNotification(notification);},duration);}}
function closeNotification(notification){
notification.classList.remove('show');
setTimeout(function(){notification.remove();},300);}});
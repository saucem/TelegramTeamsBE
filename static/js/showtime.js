function startTime(){
  today=new Date();
  d=today.getDate();
  mt=today.getMonth() + 1;
  y=today.getFullYear();
  h=today.getHours();
  m=today.getMinutes();
  s=today.getSeconds();
  m=checkTime(m);
  s=checkTime(s);
  document.getElementById('date-time').innerHTML = h + ":" + m + " - " + d + "/" + mt + "/" + y;
  t=setTimeout('startTime()',500);
}

function checkTime(i){
  if (i<10) {i="0" + i;}return i;
}

window.onload=function(){startTime();}
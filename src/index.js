function test() {
  console.log('test')
}

test()

document.body.addEventListener('click', () => {
//  log.debug( 'Clicked body')

  var logTab = tabs.getTab(1);
})

function setupTab()
{
  let tabGroup = new TabGroup();
  tabGroup.addTab({
    title: "Operation",
    src: "operation.html",
    visible: true,
    active : true,
    closable : false
  });
  
  tabGroup.addTab({
    title: "Log",
    src: "log.html",
    visible: true,
    active : false,
    closable : false
  });
  
  return tabGroup;
}



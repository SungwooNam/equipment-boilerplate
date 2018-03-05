class Tab {
  constructor() {
    this.content = document.getElementsByClassName("tabcontent");
    this.links = document.getElementsByClassName("tablinks");
  }

  select(evt, tabId) {
    for (var i = 0; i < this.content.length; i++) {
      this.content[i].style.display = "none";
    }

    for (var i = 0; i < this.links.length; i++) {
      this.links[i].className = this.links[i].className.replace(" active", "");
    }

    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";
  }
}

module.exports = Tab;
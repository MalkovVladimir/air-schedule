function IkeaFormBuilder(options) {
  /**
   * Для сохранности изначального объекта, делаем копию options.
   * В es6 я бы создал копию посредством let или юзал бы Object.assign().
   * */
  this.options = JSON.parse(JSON.stringify(options));
  this.rootElem = document.getElementById('IkeaFormBuilder');
  
  this._inputsData = [];
  this._inputIndex = 0;

  if (!this.rootElem)
    throw new Error('IkeaFormBuilder error: rootElem not found');

  this._customControls = {
    checkboxGroup: function (option) {
      return this._createGroupControl(option, 'checkbox');
    }.bind(this),
    radioGroup: function (option) {
      return this._createGroupControl(option, 'radio');
    }.bind(this),
    simpleList: function (option) {
      return this._createGroupControl(option);
    }.bind(this)
  };

  options.forEach(function (option) {
    var node = this.createNewElement(option);

    if (this.rootElem.children.length > 0)
      this.rootElem.appendChild(document.createElement('br'));
    
    this.rootElem.appendChild(node);
  }.bind(this));

  this.sendData();
  console.log(this._inputsData);
}

IkeaFormBuilder.prototype._createGroupControl = function (option, childsType) {
  //var optionCopy = {};
  //this._copyProps(option, optionCopy);
  option.type = 'ul';
  if (childsType) option.classList = ['undecoratedList'];
  var elem = this.createNewElement(option);

  var groupName = 'metaName' + Math.floor(Math.random() * 10000);
  option.values.forEach(function (val) {
    var liElem = document.createElement('li');
    var inputID = 'metaLabel' + Math.floor(Math.random() * 10000);

    if (childsType)
      liElem.appendChild(this.createNewElement({
        type: 'input',
        properties: { type: childsType, id: inputID, name: groupName }
      }));

    liElem.appendChild(this.createNewElement({
      type: 'label',
      properties: { innerText: val, htmlFor: inputID }
    }));

    elem.appendChild(liElem);
  }.bind(this));

  if (option.label) {
    var divWrap = document.createElement('div');
    divWrap.appendChild(this.createNewElement({
      type: 'h4',
      properties: { innerText: option.label }
    }));
    divWrap.appendChild(elem);
    return divWrap;
  }

  return elem;
}

IkeaFormBuilder.prototype._copyProps = function (obj1, obj2) {
  for (propName in obj1)
    obj2[propName] = obj1[propName];
}

IkeaFormBuilder.prototype.createNewElement = function (option) {
  var elem = document.createElement(option.type);

  if (elem.toString() === '[object HTMLUnknownElement]')
    if (!this._customControls[option.type])
      throw new Error('IkeaFormBuilder error: unknown elemnt type ' + option.type);
    else
      return this._customControls[option.type](option);

  this._copyProps(option.properties, elem);

  if (option.type === 'input' && this._inputsData.length > 0) {
    elem.innerText = this._inputsData[this._inputIndex];
    this._inputIndex++;
  }

  if (option.classList)
    //classList.add(['example', 'example2']) => className = 'example, example2'
    elem.className += option.classList.join(' ');

  if (option.childs)
    option.childs.forEach(function (child) {
      elem.appendChild(this.createNewElement(child));
    }.bind(this));

  return elem;
}

IkeaFormBuilder.prototype.sendData = function () {
  var inputs = this.rootElem.querySelectorAll('input');

  if (inputs)
    inputs.forEach(function (input) {
      this._inputsData.push(input.value);
    }.bind(this));
}
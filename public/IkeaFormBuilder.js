function IkeaFormBuilder(options) {
  /**
   * Для сохранности изначального объекта, делаем копию options.
   * В es6 я бы создал копию посредством let или юзал бы Object.assign().
   * */
  this.options = JSON.parse(JSON.stringify(options));
  this.rootElem = document.getElementById('IkeaFormBuilder');

  this._inputsData = {};
  this._inputIndex = 0;

  if (!this.rootElem)
    throw new Error('IkeaFormBuilder error: rootElem not found');

  /**
   * Funcs for creating custom controls.
   * Just abstraction, to create more complex html.
   */
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

    var node;
    try {
      node = this.createNewElement(option);
    } catch (err) {
      // create notification control
      this.rootElem.appendChild(this.createNewElement({
        type: 'h4',
        properties: {
          innerText: 'Ошибка при создании компонента: ' + err.message
        },
        classList: ['formBuilderError']
      }));
      return;
    }

    if (this.rootElem.children.length > 0)
      this.rootElem.appendChild(document.createElement('br'));

    this.rootElem.appendChild(node);
  }.bind(this));

  this.sendData();
  console.log(this._inputsData);
}

/**
 * func generates ul wrap and 
 * li for every value in option.values array.
 */
IkeaFormBuilder.prototype._createGroupControl = function (option, childsType) {
  option.type = 'ul';
  if (childsType) option.classList = ['undecoratedList'];
  var elem = this.createNewElement(option);

  var groupName = this._GetId();
  option.values.forEach(function (val) {
    var liElem = document.createElement('li');

    // code for linkage inputs with labels
    var inputID = this._GetId();
    if (childsType) {
      liElem.appendChild(this.createNewElement({
        type: 'input',
        properties: {
          type: childsType,
          id: inputID,
          name: groupName
        }
      }));
    }

    liElem.appendChild(this.createNewElement({
      type: 'label',
      properties: { innerText: val, htmlFor: inputID }
    }));

    elem.appendChild(liElem);
  }.bind(this));

  // Wraper for insert header
  if (option.label) {
    var divWrap = document.createElement('div');
    divWrap.appendChild(this.createNewElement({
      type: 'h4',
      properties: { innerText: option.label },
      classList: ['formBuilderLabel']
    }));
    divWrap.appendChild(elem);

    return divWrap;
  }

  return elem;
}

IkeaFormBuilder.prototype.createNewElement = function (option) {
  var elem = document.createElement(option.type);

  // check custom control or unknown elemnt (error)
  if (elem.toString() === '[object HTMLUnknownElement]')
    if (!this._customControls[option.type])
      throw new Error('IkeaFormBuilder error: unknown elemnt type ' + option.type);
    else
      return this._customControls[option.type](option);

  // create id, if option does not have
  if (!option.properties)
    option.properties = { id: this._GetId() };
  else if (option.properties && !option.properties.id)
    option.properties.id = this._GetId();

  this._copyProps(option.properties, elem);

  if (option.classList)
    elem.className += option.classList.join(' ');

  // childs generation
  if (option.childs)
    option.childs.forEach(function (child) {
      elem.appendChild(this.createNewElement(child));
    }.bind(this));

  return elem;
}

// Because of es5
IkeaFormBuilder.prototype._copyProps = function (obj1, obj2) {
  for (propName in obj1)
    obj2[propName] = obj1[propName];
}

IkeaFormBuilder.prototype._GetId = function () {
  return 'metaID' + Math.floor(Math.random() * 100000);
}

IkeaFormBuilder.prototype.sendData = function () {
  var inputs = this.rootElem.querySelectorAll('input');

  if (inputs.length > 0)
    Array.prototype.forEach.call(inputs, function (input) {
      if (input.type == 'radio' || input.type == 'checkbox')
        this._inputsData[input.id] = input.checked;
      else
        this._inputsData[input.id] = input.value;
    }.bind(this));
}
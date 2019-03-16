/**
 *  Класс компонента фильтр
 *
 * @param {DOM} container - Контейнер для компонента
 *
 */

class Filter {
  constructor(container) {
    this.container = container;
    this.filtersData = [
      {
        title: 'text field',
        options: [
          'containing',
          'exactly matching',
          'begins with',
          'ends with',
        ],
      },
      {
        title: 'number field',
        options: [
          'equal',
          'greater than',
          'less than',
        ],
      },
    ];

    this.createForm();
  }

  /**
   * Создание формы с выпадашками и кнопками
   *
   *
   */
  createForm() {
    this.formFilters = document.createElement('div');
    this.formFilters.classList.add('filters__list');

    this.addFilterButton = document.createElement('button');
    this.addFilterButton.classList.add('filters__add-button');
    this.addFilterButtonText = document.createElement('span');
    this.addFilterButtonText.textContent = 'add condition';
    this.addFilterButton.appendChild(this.addFilterButtonText);

    this.formControls = this.createFormControls();
    this.formControls.classList.add('filters__controls');

    this.form = document.createElement('form');
    this.form.classList.add('filters');
    this.form.appendChild(this.formFilters);
    this.form.appendChild(this.addFilterButton);
    this.form.appendChild(this.formControls);
    this.form.addEventListener('click', this.handleFormClicks.bind(this));

    this.addFilter();

    this.container.appendChild(this.form);
  }

  /**
   *  Метод создания кнопок управления формой
   *
   * @return {DOM} элемент c кнопками управления формой
   *
   */
  createFormControls() {
    const formControls = document.createElement('div');
    this.applyButton = document.createElement('button');
    this.clearButton = document.createElement('button');

    this.applyButton.textContent = 'apply';
    this.clearButton.textContent = 'clear filter';
    this.applyButton.classList.add('filters__controls-button');
    this.applyButton.classList.add('filters__controls-button_apply');
    this.clearButton.classList.add('filters__controls-button');
    this.clearButton.classList.add('filters__controls-button_clear');
    formControls.appendChild(this.applyButton);
    formControls.appendChild(this.clearButton);

    return formControls;
  }

  /**
   * Обработка кликов на форме
   *
   * @param {event} e - событие по нажатиюж
   *
   */
  handleFormClicks(e) {
    e.preventDefault();

    // закрываем активную выпадашку при клике мимо
    const activeFilters = Array.from(this.formFilters.querySelectorAll('.select__value_active'));
    if (activeFilters.length > 1) {
      activeFilters.forEach((item) => {
        item.classList.remove('select__value_active');
        item.nextElementSibling.classList.remove('select__options_visible');
      });
    }

    if (e.target === this.addFilterButton) {
      this.addFilter();
    }

    if (e.target === this.clearButton) {
      while (this.formFilters.firstChild) {
        this.formFilters.removeChild(this.formFilters.firstChild);
      }

      this.addFilter();
    }

    if (e.target === this.applyButton) {
      const filters = this.formFilters.children;
      const result = {
        text: [],
        number: [],
      };
      [].forEach.call(filters, (item) => {
        const filterType = item.querySelector('.filter__type .select__value').value;
        const type = filterType.split(' ')[0].toLowerCase();
        const filterOperation = item.querySelector('.filter__conditions .select__value').value.toLowerCase();
        const filterValue = item.querySelector('.filter__input').value;

        result[type].push({
          operation: filterOperation,
          value: filterValue,
        });
      });

      // eslint-disable-next-line no-console
      console.log(result);
    }
  }

  /**
   * Метод добавления нового фильтра
   * добавляет не более 10 фильтров
   *
   */
  addFilter() {
    if (this.formFilters.children.length >= 10) return;

    const filter = this.createFilter();
    this.formFilters.appendChild(filter);

    if (this.formFilters.children.length > 1) {
      const filters = this.formFilters.children;
      [].forEach.call(filters, (item) => {
        item.classList.remove('filter_removable_no');
      });
    } else {
      this.formFilters.firstChild.classList.add('filter_removable_no');
    }
  }

  /**
   *  Метод создания новой строки фильтра
   *
   * @return {DOM} элемент новая строка фильтра
   *
   */
  createFilter() {
    const filterItem = document.createElement('div');
    const filterType = this.createFilterType();
    const filterOptions = this.createFilterConditions(filterType.value);
    const filterInput = this.createFilterInput('text');

    filterItem.classList.add('filters__item');
    filterItem.classList.add('filter');

    filterItem.appendChild(filterType.block);
    filterItem.appendChild(filterOptions);
    filterItem.appendChild(filterInput);

    const filterRemove = document.createElement('button');
    filterRemove.classList.add('filter__remove');

    filterRemove.addEventListener('click', this.removeFilter.bind(this));
    filterItem.appendChild(filterRemove);

    return filterItem;
  }

  /**
   *  Метод удаления фильтра
   *
   * @param {event} e - событие по нажатию кнопки 'Х' или блок для удаления
   *
   */
  removeFilter(e) {
    const block = e.currentTarget || e;
    block.removeEventListener('click', this.removeFilter);
    this.formFilters.removeChild(block.parentNode);

    if (this.formFilters.children.length === 1) {
      this.formFilters.children[0].classList.remove('filter_removable_yes');
      this.formFilters.children[0].classList.add('filter_removable_no');
    }
  }

  /**
   *  Метод создания поля выбора типа фильтра
   *
   * @return {DOM} поле выбора типа фильтра
   *
   */
  createFilterType() {
    const options = this.filtersData.map(item => item.title);
    const filter = this.createFilterItem(options, 'type');

    return filter;
  }

  /**
   *  Метод создания поля выбора условия фильтра
   *
   * @param {string} type тип фильтра
   * @return {DOM} поле выбора условия фильтра
   *
   */
  createFilterConditions(type) {
    const filterType = type.toLowerCase();
    const [{ options }] = this.filtersData.filter(item => item.title === filterType);
    const filter = this.createFilterItem(options, 'conditions');

    return filter.block;
  }

  /**
   *  Метод создания выпадашки
   *
   * @param {array} options массив доступных значений выпадашки
   * @param {string} elemName название элемента класса
   * @return {DOM} поле выбора условия фильтра
   *
   */
  createFilterItem(options, elemName) {
    const text = options[0][0].toUpperCase() + options[0].slice(1).toLowerCase();

    const filter = document.createElement('div');
    filter.classList.add(`filter__${elemName}`);
    filter.classList.add('select');

    const filterInput = document.createElement('input');
    filterInput.classList.add('select__value');
    filterInput.setAttribute('type', 'text');
    filterInput.setAttribute('readonly', true);
    filterInput.setAttribute('value', text);

    const filterOptions = this.createOptions(options);

    filter.appendChild(filterInput);
    filter.appendChild(filterOptions);
    filter.addEventListener('click', this.handleFilterValue.bind(this));

    return {
      block: filter,
      value: filterInput.value,
    };
  }

  /**
   * Заполнение значений полей фильтра
   *
   * @param {array} options значения полей фильтря
   *
   */
  createOptions(options) {
    const filterOptions = document.createElement('ul');
    filterOptions.classList.add('select__options');

    // создаем варианты для выпадашки
    options.forEach((item) => {
      const option = document.createElement('li');
      option.classList.add('select__option');
      option.classList.add('option');

      const optionLabel = document.createElement('label');
      optionLabel.classList.add('option__label');

      const optionText = document.createElement('span');
      optionText.classList.add('option__text');
      optionText.textContent = item[0].toUpperCase() + item.slice(1).toLowerCase();

      const optionInput = document.createElement('li');
      optionInput.classList.add('option__input');
      optionInput.setAttribute('type', 'radio');
      optionInput.setAttribute('value', item.split(' ')[0]);
      optionInput.setAttribute('name', 'filter');

      optionLabel.appendChild(optionText);
      optionLabel.appendChild(optionInput);

      option.appendChild(optionLabel);

      filterOptions.appendChild(option);
    });

    return filterOptions;
  }

  /**
   *  Метод создания поля ввода
   *
   * @param {string} type тип значений инпута
   * @return {DOM} инпут с выбранным типом
   *
   */
  createFilterInput(type) {
    const filterInput = document.createElement('input');
    filterInput.classList.add('filter__input');
    filterInput.setAttribute('type', type);

    return filterInput;
  }

  /**
   *  Выбор выпадающего значения
   *
   * @param {event} e событие изменения типа фильтра
   *
   */
  handleFilterValue(e) {
    const filter = e.currentTarget;
    const optionsBlock = filter.querySelector('.select__options');
    const options = Array.from(filter.querySelectorAll('.option'));
    const input = filter.querySelector('.select__value');
    const filterValue = input.value;

    // обработка выбора значения
    if (optionsBlock.classList.contains('select__options_visible')) {
      optionsBlock.classList.remove('select__options_visible');
      input.classList.remove('select__value_active');
    } else {
      optionsBlock.classList.add('select__options_visible');
      input.classList.add('select__value_active');
    }

    if (options.includes(e.target)) {
      const value = e.target.querySelector('.option__text').textContent;
      input.value = value[0].toUpperCase() + value.slice(1);

      optionsBlock.classList.remove('select__options_visible');
      input.classList.remove('select__value_active');
    }

    // заполнение типа значений и значений условий при выборе типа фильтра
    if (filter.classList.contains('filter__type') && filterValue !== input.value) {
      const filterInput = filter.parentNode.querySelector('.filter__input');
      filterInput.setAttribute('type', input.value.split(' ')[0].toLowerCase());

      const filterConditions = filter.parentNode.querySelector('.filter__conditions');
      filter.parentNode.removeChild(filterConditions);
      filter.parentNode.insertBefore(
        this.createFilterConditions(input.value.toLowerCase()),
        filterInput,
      );
    }
  }
}

export default Filter;

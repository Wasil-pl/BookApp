'use strict';
{
  const select = {
    form: '.filters',

    books: {
      bookList: '.books-list',
      bookImage: 'book__image',
      bookImageID: 'data-id',
    },

    templateOf: {
      bookTemplate: '#template-book',
    },

    class: {
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  const templates = {
    bookCard: Handlebars.compile(
      document.querySelector(select.templateOf.bookTemplate).innerHTML
    ),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;
      this.data = dataSource.books;

      for (const book of this.data) {
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;
  
        const generatedHTML = templates.bookCard(book);
  
        const singleBook = utils.createDOMFromHTML(generatedHTML);
  
        const listOfBooks = document.querySelector(select.books.bookList);
  
        listOfBooks.appendChild(singleBook);
      }
    }
  
    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {
        booksList: document.querySelector(select.books.bookList),
        filteredBooks: document.querySelector(select.form)
      };
    }
  
    initActions() {
      const thisBooksList = this;

      const filters = [];
      const favoritesBooks = [];

      thisBooksList.dom.filteredBooks.addEventListener('click', function (event) {
        const clickedElement = event.target;
        if (
          clickedElement.tagName === 'INPUT' &&
          clickedElement.type === 'checkbox' &&
          clickedElement.name === 'filter'
        ) {
          if (!filters.includes(clickedElement.value)) {
            filters.push(clickedElement.value);
          } else {
            const index = filters.indexOf(clickedElement.value);
            filters.splice(index, 1);
          }
        }
        thisBooksList.filterBooks(filters);
      });

      thisBooksList.dom.booksList.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const book = event.target.offsetParent;

        if (book.classList.contains(select.books.bookImage)) {
          book.classList.toggle(select.class.favorite);
          const bookImageID = book.getAttribute(select.books.bookImageID);

          if (book.classList.contains(select.class.favorite) && book !== null) {
            favoritesBooks.push(bookImageID);
          } else {
            const indexId = favoritesBooks.indexOf(bookImageID);
            favoritesBooks.splice(indexId, 1);
          }
        }
      });
    }

    filterBooks(filters) {
      const dataBooks = dataSource.books;

      for (const book of dataBooks) {
        let shouldBeHidden = false;
        for (const filter of filters) {

          if(!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImg = document.querySelector('.book__image[data-id="' + book.id + '"]');
        if(shouldBeHidden == true) {
          bookImg.classList.add(select.class.hidden);
        } else if (shouldBeHidden == false) {
          bookImg.classList.remove(select.class.hidden);
        }
      }
    }
  
    determineRatingBgc(rating) {
      let ratingBgc = '';
      if (rating < 6) {
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%';
      }
      else if (rating > 6 && rating <= 8) {
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%';
      }
      else if (rating > 8 && rating <= 9) {
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
      }
      else if (rating > 9) {
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%';
      }
      return ratingBgc;
    }
  }

  new BooksList();
}

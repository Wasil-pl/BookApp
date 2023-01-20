{
  ('use strict');

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

  const favoritesBooks = [];
  const filters = [];

  function dataSourceBooks() {
    for (const book of dataSource.books) {
      const generatedHTML = templates.bookCard(book);

      const singleBook = utils.createDOMFromHTML(generatedHTML);

      const listOfBooks = document.querySelector(select.books.bookList);

      listOfBooks.appendChild(singleBook);
    }
  }

  function initAction() {
    const booksList = document.querySelector(select.books.bookList);
    const filteredBooks = document.querySelector(select.form);

    filteredBooks.addEventListener('click', function (event) {
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
        console.log(filters);
      }
      filterBooks();
    });



    booksList.addEventListener('dblclick', function (event) {
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

      console.log('FavoritesBooks: ', favoritesBooks);
    });

    function filterBooks () {
      const dataBooks = dataSource.books;
      console.log('books: ', dataBooks);
      for (const book of dataBooks) {
        console.log('books: ', book);
        let shouldBeHidden = false;
        for (const filter of filters) {
          console.log(filter);
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
  }

  dataSourceBooks();
  initAction();
}

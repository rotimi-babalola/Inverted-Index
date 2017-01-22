(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  },

  {
  	"title": "Fifty Shades Of Grey",
  	"text": "A billionaire with a tormented past finds redemption in a young girl"
  },

  {
  	"title": "Things fall apart",
  	"text": "An African classic about an Igbo wrestler"
  }

]

},{}],2:[function(require,module,exports){
module.exports=[
  {
  	"title": "Harry Potter",
  	"text": "A young orphan becomes a powerful wizard"
  },

  {
  	"title": "James Bond",
  	"text": "A British spy takes on dangerous criminal organizations"
  }

]

},{}],3:[function(require,module,exports){
module.exports=[

]
},{}],4:[function(require,module,exports){
 const docs       = require('./books');
 const docs_2     = require('./books_2');
 const emptyDoc   = require('./empty.json');
 const invalidDoc = require('./invalid.json');
//A test suite to read data from books
describe('Test suite for Inverted Index', () => {
  //create an object of the Inverted Index class
  const theIndex = new InvertedIndex();
  //const emptyDoc = [];
  const sentence        = "This# is@ a Sample *sentence &with some some ^dirt";
  const multSearchTerms = "An Alice man tormented market".split(' ');
  const allSearchTerms  = "Powerful dangerous young spy wizard elf".split(' ');

  //create inverted indexes from the filenames
  theIndex.createIndex('books.json', docs);
  theIndex.createIndex('books_2.json', docs_2);
  theIndex.createIndex('empty_doc.json', emptyDoc);
  theIndex.createIndex('invalid_doc.json', invalidDoc);

  /*
  * Object that stores all the indexes created for every file
  * It ensures that a new index does not overwrite the current index
  * key -> String that is the name of the file
  * value -> Inverted Index for that file
  */
  let allIndexes = theIndex.getIndex();

  //create an Inverted Index for the file
  theIndex.getIndex(docs);

  describe('Inverted Index Class', () => {
    it('Should be an instance of a class', () => {
      expect(theIndex instanceof InvertedIndex).toBe(true);
      expect(theIndex instanceof Object).toBe(true);
      expect(typeof theIndex).toBe('object');
    });
  });

  describe('Test for the cleaning function', () => {
    it('Should return an array of strings', () => {
      expect(theIndex.clean(sentence).constructor).toBe(Array);
    });

    it('Should not contain non-alphanumeric characters', () => {
      expect(theIndex.clean(sentence)).not.toContain(/[#@^&]/g);
    });

    it('Should have the correct number of words', () => {
      expect(theIndex.clean(sentence).length).toBe(9);
    });

    it('Should have the clean method defined', () => {
      expect(theIndex.clean).toBeDefined();
    });
  });

  describe('Test for removing duplicates', () => {
      it('Should not contain duplicate words', () => {
        let testArray = theIndex.removeDuplicates(theIndex.clean(sentence));
        expect(testArray.length).toBe(new Set(testArray).size);
      });

      it('Should have the removeDuplicates method defined', () => {
        expect(theIndex.removeDuplicates).toBeDefined();
      });
    });

    describe('Read book data', () => {
      it('Should confirm that an empty JSON file is empty', () => {
        let emptyIndex = allIndexes['empty_doc.json'];
        expect(emptyIndex).toBe('JSON file is empty');
      });

      it('Should confirm that an invalid JSON file is invalid', () => {
        let invalidIndex = allIndexes['invalid_doc.json'];
        expect(invalidIndex).toBe('JSON file is invalid');
      });

      it('Should confirm that a non-empty file is not empty', () => {
        expect(theIndex.getIndex(docs)).not.toBe('JSON file is empty');
      });

      it('Should have the getIndex method defined', () => {
        expect(theIndex.getIndex).toBeDefined();
      });

      //Tests for Exceeds

    });

    describe('Populate Index', () => {
      it('Should verify Index is created', () => {
        //this verifies that an entry for a word is created
        expect(allIndexes['books.json'].alice).toBeDefined();
      });

      it('Should map words to correct docs', () => {
        expect(allIndexes['books.json'].alice).toEqual([1]);
        expect(allIndexes['books.json'].a).toEqual([1, 2, 3]);
      });

      //Should ensure a new index is not overwritten
      //This will be tested in two ways
      it('Should ensure a new index does not overwrite other indexes', () => {
        //check that allIndexes Object has number of keys greater than 1
        expect(Object.keys(allIndexes).length).toBeGreaterThan(1);
      });
    });

    describe('Search index', () => {
      it('Should have searchIndex method defined', () => {
        expect(theIndex.searchIndex).toBeDefined();
      });

      it('Should return the correct results', () => {
        expect(theIndex.searchIndex('books.json','ring')).toEqual({'ring':[2]});
      });

      it('Should return the correct results', () => {
        expect(theIndex.searchIndex('books.json', 'an')).toEqual({'an':[2, 4]});
      });

      it('Should return correct results for searching all documents', () => {
        expect(theIndex.searchIndex('books.json', multSearchTerms)).toEqual({
          'an': [2, 4],
          'alice': [1],
          'man': [2],
          'tormented': [3],
          'market': 'Word not found!'
        });
      });

      it('Should return correct results when filename is not specified', () => {
        expect(theIndex.searchIndex(allSearchTerms)).toEqual(
          { 'books.json':
              { powerful: [ 2 ],
                dangerous: 'Word not found!',
                young: [ 3 ],
                spy: 'Word not found!',
                wizard: [ 2 ],
                elf: [ 2 ] },
              'books_2.json':
              { powerful: [ 1 ],
                dangerous: [ 2 ],
                young: [ 1 ],
                spy: [ 2 ],
                wizard: [ 1 ],
                elf: 'Word not found!' },
              'empty_doc.json':
              { powerful: 'Word not found!',
                dangerous: 'Word not found!',
                young: 'Word not found!',
                spy: 'Word not found!',
                wizard: 'Word not found!',
                elf: 'Word not found!' },
              'invalid_doc.json':
              { powerful: 'Word not found!',
                dangerous: 'Word not found!',
                young: 'Word not found!',
                spy: 'Word not found!',
                wizard: 'Word not found!',
                elf: 'Word not found!' }}
        );
      });

      //check for search time
      it('Should be able to handle an array of search arguments', () => {
      expect(theIndex.searchIndex(['an', 'ring', 'a'], 'life')).toEqual(
          { 'books.json':
              { an: [ 2, 4 ],
                ring: [ 2 ],
                a: [ 1, 2, 3 ],
                life: 'Word not found!' },
              'books_2.json':
              { an: 'Word not found!',
                ring: 'Word not found!',
                a: [ 1, 2 ],
                life: 'Word not found!' },
              'empty_doc.json':
              { an: 'Word not found!',
                ring: 'Word not found!',
                a: 'Word not found!',
                life: 'Word not found!' },
              'invalid_doc.json':
              { an: 'Word not found!',
                ring: 'Word not found!',
                a: 'Word not found!',
                life: 'Word not found!' }}
        );
      });

      it('Should ensure search does not take too long', () => {
        let end, start;
        //We set a threshold of 5 milliseconds
        start = new Date();
        //Search
        //Here we don't specify a file we search all files
        theIndex.searchIndex(['an', 'ring', 'a'], 'life');
        end = new Date();
        expect(end.getTime() - start.getTime()).toBeLessThan(5);
      });
    });
});
},{"./books":1,"./books_2":2,"./empty.json":3,"./invalid.json":5}],5:[function(require,module,exports){
module.exports=[
  {
    "name": "John Doe",
    "number": 1234567890
  }
]

},{}]},{},[4])
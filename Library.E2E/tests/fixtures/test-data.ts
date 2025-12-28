export const testAuthors = {
  rowling: {
    name: "J.K. Rowling",
    nationality: "British"
  },
  orwell: {
    name: "George Orwell",
    nationality: "British"
  }
};

export const testBooks = {
  hp1: (authorId: number) => ({
    title: "Harry Potter and the Philosopher's Stone",
    genre: "Fantasy",
    authorId,
    availableCopies: 5
  }),
  nineteen84: (authorId: number) => ({
    title: "1984",
    genre: "Dystopian",
    authorId,
    availableCopies: 3
  })
};

export const testUsers = {
  alice: "AliceTestUser",
  bob: "BobBorrower"
};

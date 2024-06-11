import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  try {
    const { bookName, authorID, authorName } = await readBody(event);

    if (!bookName || !authorName) {
      return {
        statusCode: 400,
        message: "Book Name and Author Name are required",
      };
    }

    const insertBook = await prisma.book.create({
      select: {
        bookID: true,
        authorID: true,
        bookName: true,
        bookCreatedDate: true,
        author: {
          select: {
            authorID: true,
            authorName: true,
            authorCreatedDate: true,
          },
        },
      },
      data: {
        bookName: bookName || undefined,
        bookCreatedDate: DateTime.now(),
        author: {
          connectOrCreate: {
            where: {
              authorID: authorID,
            },
            create: {
              authorName: authorName,
              authorCreatedDate: DateTime.now(),
            },
          },
        },
      },
    });

    console.log("Book Created: ", insertBook);

    if (!insertBook) {
      return {
        statusCode: 400,
        message: "Book not created",
      };
    }

    // Delete the latest book and author
    // const deleteBook = await prisma.book.delete({
    //   where: {
    //     bookID: insertBook.bookID,
    //   },
    // });

    // console.log("Book Deleted: ", deleteBook);

    // const deleteAuthor = await prisma.author.delete({
    //   where: {
    //     authorID: insertBook.authorID,
    //   },
    // });

    // console.log("Author Deleted: ", deleteAuthor);

    return {
      statusCode: 200,
      message: "Book Created",
      data: insertBook,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

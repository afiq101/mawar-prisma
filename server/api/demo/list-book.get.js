import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  try {
    const books = await prisma.book.findMany({
      select: {
        bookID: true,
        bookName: true,
        bookCreatedDate: true,
        bookModifiedDate: true,
        author: {
          select: {
            authorID: true,
            authorName: true,
            authorDOB: true,
          },
        },
      },
    });

    if (!books) {
      return {
        statusCode: 400,
        message: "Books not found",
      };
    }

    let no = 1;
    const remapTable = books.map((book) => {
      return {
        no: no++,
        bookName: book.bookName,
        authorName: book.author.authorName,
        bookCreatedDate: book.bookCreatedDate
          ? DateTime.fromJSDate(book.bookCreatedDate).toFormat(
              "dd MMMM yyyy HH:mm"
            )
          : "",
        bookModifiedDate: book.bookModifiedDate
          ? DateTime.fromJSDate(book.bookModifiedDate).toFormat(
              "dd MMMM yyyy HH:mm"
            )
          : "",
        action: {
          bookID: book.bookID,
          authorID: book.author.authorID,
        },
      };
    });

    console.log("Books: ", remapTable);

    return {
      statusCode: 200,
      message: "Books List",
      data: remapTable,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

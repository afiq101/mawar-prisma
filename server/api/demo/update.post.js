import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  try {
    const { bookID, bookName, authorID, authorName } = await readBody(event);

    if (!bookName || !authorName) {
      return {
        statusCode: 400,
        message: "Book Name and Author Name are required",
      };
    }

    const updateBook = await prisma.book.update({
      where: {
        bookID: bookID,
      },
      data: {
        bookName: bookName,
        bookModifiedDate: DateTime.now(),
        author: {
          connectOrCreate: {
            create: {
              authorName: authorName,
              authorCreatedDate: DateTime.now(),
            },
            where: {
              authorID: authorID,
            },
          },
        },
      },
    });

    if (!updateBook) {
      return {
        statusCode: 400,
        message: "Book not updated",
      };
    }

    console.log("Book Updated: ", updateBook);

    return {
      statusCode: 200,
      message: "Book Updated",
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

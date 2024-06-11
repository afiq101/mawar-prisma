export default defineEventHandler(async (event) => {
  try {
    const { bookID } = await readBody(event);

    if (!bookID) {
      return {
        statusCode: 400,
        message: "Book ID is required",
      };
    }

    const deleteBook = await prisma.book.delete({
      where: {
        bookID: bookID,
      },
    });

    if (!deleteBook) {
      return {
        statusCode: 400,
        message: "Book not deleted",
      };
    }

    console.log("Book Deleted: ", deleteBook);

    return {
      statusCode: 200,
      message: "Book Deleted",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

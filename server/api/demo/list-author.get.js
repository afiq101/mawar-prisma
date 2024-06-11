export default defineEventHandler(async (event) => {
  try {
    const authors = await prisma.author.findMany({
      select: {
        authorID: true,
        authorName: true,
      },
    });

    if (!authors) {
      return {
        statusCode: 400,
        message: "Authors not found",
      };
    }

    const remapOptions = authors.map((author) => {
      return {
        label: author.authorName,
        value: author.authorID,
      };
    });

    console.log("Authors: ", remapOptions);

    return {
      statusCode: 200,
      message: "Authors List",
      data: remapOptions,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

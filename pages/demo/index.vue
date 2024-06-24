<script setup>
definePageMeta({
  title: "Demo",
});

const { $swal } = useNuxtApp();

// Add Form
const form = reactive({
  name: "",
  author: "",
});
const showModalAdd = ref(false);

// Edit Form
const formEdit = reactive({
  id: "",
  name: "",
  author: "",
});
const showModalEdit = ref(false);

const {
  data: bookList,
  pending: bookPending,
  refresh: refreshBookList,
} = await useFetch("/api/demo/list-book", {
  method: "GET",
});

const {
  data: authorOptions,
  pending: authorPending,
  refresh: refreshAuthorList,
} = await useFetch("/api/demo/list-author", {
  method: "GET",
});

const submit = async () => {
  try {
    const { data } = await useFetch("/api/demo/create", {
      method: "POST",
      body: {
        bookName: form.name,
        authorID: form.author?.value || 0,
        authorName: form.author?.label || form.author,
      },
    });

    // console.log(data.value);

    if (data.value.statusCode == 200) {
      $swal.fire({
        title: "Success",
        text: "Book has been added",
        icon: "success",
      });

      showModalAdd.value = false;
      form.name = "";
      form.author = "";
      await refreshBookList();
      await refreshAuthorList();
    } else {
      $swal.fire({
        title: "Failed",
        text: "Failed to add book",
        icon: "error",
      });
    }
  } catch (error) {}
};

const openModalEdit = (data) => {
  formEdit.id = data.action.bookID;
  formEdit.name = data.bookName;
  formEdit.author = {
    value: data.action.authorID,
    label: data.authorName,
  };
  showModalEdit.value = true;
};

const editSubmit = async () => {
  try {
    const { data } = await useFetch("/api/demo/update", {
      method: "POST",
      body: {
        bookID: formEdit.id,
        bookName: formEdit.name,
        authorID: formEdit.author?.value || 0,
        authorName: formEdit.author?.label || formEdit.author,
      },
    });

    if (data.value.statusCode == 200) {
      $swal.fire({
        title: "Success",
        text: "Book has been updated",
        icon: "success",
      });

      showModalEdit.value = false;
      formEdit.id = "";
      formEdit.name = "";
      formEdit.author = "";
      await refreshBookList();
      await refreshAuthorList();
    } else {
      $swal.fire({
        title: "Failed",
        text: "Failed to update book",
        icon: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteBook = async (id) => {
  try {
    $swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await useFetch("/api/demo/delete", {
            method: "POST",
            body: {
              bookID: id,
            },
          });

          if (data.value.statusCode == 200) {
            $swal.fire({
              title: "Success",
              text: "Book has been deleted",
              icon: "success",
            });

            await refreshBookList();
            await refreshAuthorList();
          } else {
            $swal.fire({
              title: "Failed",
              text: "Failed to delete book",
              icon: "error",
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card class="p-5">
      Prisma URL:
      <a
        class="text-blue-500 hover:underline"
        href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-a-deeply-nested-tree-of-records"
        >https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-a-deeply-nested-tree-of-records</a
      >
    </rs-card>
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          Book List
          <rs-button @click="showModalAdd = !showModalAdd">
            <Icon name="solar:add-square-broken" class="mr-2" />
            Add Book
          </rs-button>
        </div>
      </template>
      <template #body>
        <Icon v-if="bookPending" name="line-md:loading-twotone-loop" />
        <rs-table
          v-else-if="!bookPending && bookList?.data?.length > 0"
          :data="bookList.data"
          :key="bookList.data"
          :field="[
            'Id',
            'Book Name',
            'Author',
            'Created At',
            'Updated At',
            'Action',
          ]"
          advanced
        >
          <template #Action="data">
            <div class="flex items-center gap-4">
              <rs-button @click="openModalEdit(data.value)">
                <Icon
                  name="solar:pen-new-square-broken"
                  class="mr-2 !w-4 !h-4"
                />
                Edit
              </rs-button>

              <rs-button
                @click="deleteBook(data.value.action.bookID)"
                variant="primary-outline"
              >
                <Icon name="solar:trash-bin-2-broken" class="mr-2 !w-4 !h-4" />
                Delete
              </rs-button>
            </div>
          </template>
        </rs-table>
        <div v-else>
          <div class="text-center text-gray-500 font-semibold">
            No data available.
          </div>
        </div>
      </template>
    </rs-card>

    <rs-modal v-model="showModalAdd" title="Add Book">
      <template #body>
        <FormKit type="form" @submit="submit">
          <FormKit v-model="form.name" type="text" label="Name" />
          <label
            class="formkit-label formkit-label-global formkit-outer-text"
            for="input_5"
          >
            Author
          </label>
          <v-select
            v-model="form.author"
            class="formkit-vselect"
            name="country"
            :options="authorOptions.data || []"
            taggable
          ></v-select>
        </FormKit>
      </template>
      <template #footer> </template>
    </rs-modal>

    <rs-modal v-model="showModalEdit" title="Edit Book">
      <template #body>
        <FormKit type="form" @submit="editSubmit">
          <FormKit v-model="formEdit.name" type="text" label="Name" />
          <label
            class="formkit-label formkit-label-global formkit-outer-text"
            for="input_5"
          >
            Author
          </label>
          <v-select
            v-model="formEdit.author"
            class="formkit-vselect"
            name="country"
            :options="authorOptions.data || []"
            taggable
          ></v-select>
        </FormKit>
      </template>
      <template #footer> </template>
    </rs-modal>
  </div>
</template>

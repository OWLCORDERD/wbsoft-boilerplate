export default defineEventHandler(async (event) => {
  const baseUrl = process.env.BACKEND_BASE_URL;

  const checkListData = await $fetch(`${baseUrl}/checkList`);

  return checkListData;
});

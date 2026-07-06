export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const baseUrl = `${process.env.BACKEND_BASE_URL}/checkList`;

  const res = await $fetch(baseUrl, {
    method: "POST",
    body: body.newSchedule,
  });

  return res;
});

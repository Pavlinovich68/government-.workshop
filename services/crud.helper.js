export default class CrudHelper {
   static crud = async(controller, operation, model) => {
      model = {
         operation: operation,
         model: model
      }
      const res = await fetch(`/api/${controller}/crud`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            model
         }),
      });
      return await res.json();
   }
}
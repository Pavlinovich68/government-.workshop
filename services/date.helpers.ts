export default class DateHelper {
   static formatDate = (date?: Date | null | undefined) => {
      if (!date || date === undefined) {
         return '';
      }
      return new Date(date).toLocaleDateString('ru-RU', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
      });
   };
}
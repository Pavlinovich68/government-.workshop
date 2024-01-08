export interface Division {
   id?: number,
   name?: string,
   short_name?: string,
   contacts?: string,
   parent_id?: number,
   childrens?: Division[],
   halls?: number[],
   attachment_id?: number | undefined | null
}
export default class Category{
    constructor({
         category_id = null,
        name,
        description = null,
        image_url = null,
        is_active = true,
        created_at = null,
        updated_at = null
    }){
        if (!name || !name.trim()) {
            throw new Error('El nombre de la categoría es obligatorio');
      }
      this.category_id=category_id;
      this.name=name.trim();
      this.description = description;
      this.image_url = image_url;
      this.is_active = is_active;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
}
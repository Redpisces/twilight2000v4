/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class twilightActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["twilight2000v4", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  get template() {
    //return unique actor sheet by type, like `weapon-sheet.html`.
    const path = "systems/twilight2000v4/templates/actor";
    return `${path}/${this.actor.data.type}-sheet.html`;
  }
  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];

    if (this.actor.data.type == 'character'){
      this._prepareCharacterItems(data);
    }
    
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
    
    //embeded select
    html.find('.embeded').change(this._onEmbedSelect.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    let terms={};
        
   
  }
  _prepareCharacterItems(sheetData){
    const actorData = sheetData.actor;
    
    const gear=[];
    const weapons=[];
    
    for (let i of sheetData.items){
      let item =i.data;
      
      i.img=i.img||DEFAULT_TOKEN;
      
      switch (i.type){
        case 'item':
          gear.push(i);
          break;
        case 'gun':
          gear.push(i);
          weapons.push(i);
          break;
        default:
          gear.push(i);
          break;
      }
      actorData.gear=gear;
      actorData.weapons=weapons;
      
    }
    
  }
  async _onEmbedSelect(event){
    event.preventDefault();
    const element = event.currentTarget;
    const value=element.value;
    var path=element.name.split(".").reverse();
    const actor = this.actor;
    const li = $(element).parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));
    
    
    
    if (path.pop()!="in"){
      console.error("Unexpected data");
      return;
    }
    if (path.pop()!="data"){
      console.error("Unexpected data");
      return;
    }
    if (path.pop()!="data"){
      console.error("Unexpected data");
      return;
    }
    path.reverse();
    
    let data=_deepUpdate(item['data']['data'],path,value);
    const update = {_id: item._id, data: data};
    console.log(data);
    const updated = await actor.updateEmbeddedEntity("OwnedItem", update);
    console.log(updated);
    console.log(actor);
  }
}
function _deepUpdate(original,keys,value){
  if (keys.length === 0) {
    return value;
  }
  const currentKey = keys[0];
  if (Array.isArray(original)) {
    return original.map(
      (v, index) => index === currentKey
        ? _deepUpdate(v, keys.slice(1), value) // (A)
        : v); // (B)
  } else if (typeof original === 'object' && original !== null) {
    return Object.fromEntries(
      Object.entries(original).map(
        (keyValuePair) => {
          const [k,v] = keyValuePair;
          if (k === currentKey) {
            return [k, _deepUpdate(v, keys.slice(1), value)]; // (C)
          } else {
            return keyValuePair; // (D)
          }
        }));
  } else {
    // Primitive value
    return original;
  }
}


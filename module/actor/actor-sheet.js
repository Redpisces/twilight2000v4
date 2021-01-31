/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class twilightActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["twilight2000v4", "sheet", "actor"],
      width: 700,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  get template() {
    const path = "systems/twilight2000v4/templates/actor";

    return `${path}/${this.actor.data.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
        
    if (this.actor.data.type === 'npc'){
      this._tabs[0].active='stats';
    }

    data.dtypes = ["String", "Number", "Boolean"];
    
    if (this.actor.data.type === 'character' || this.actor.data.type === 'npc') {
      for (let [akey, avalue] of Object.entries(data.data.attributes)) {
        avalue.skills = {}
        for (let [skey, svalue] of Object.entries(data.data.skills)) {
          if (svalue.linked_atr == akey) {
            avalue.skills[skey] = svalue;
          }
        }
      }
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
    html.find('.item-delete').click(this._onItemDelete.bind(this));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    html.find('.embedded-item-attribute').change(this._onEmbededChange.bind(this));

    // Update Inventory Item
    html.find('.item-equip').click(this._onEquipClick.bind(this));
    html.find('.item-container').click(this._onContainerClick.bind(this));

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
    const name = `!New ${type.capitalize()}`;
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
  _onItemDelete(event){
    const li = $(event.currentTarget).parents(".item");
    const name = this.actor.getEmbeddedEntity("OwnedItem", li.data("itemId")).name;
    let d = new Dialog({
      title: "Delete Item",
      content: `<p>Delete item ${name} (${li.data("itemId")})</p>`,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: "Confirm",
          callback: () => {
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
          }
        },
        two: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => {}
        }
      },
      default: "two",
    });
    d.render(true);
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

    if (dataset.roll) {
      game.twilight2000v4.twilightActor.skillroll(dataset.roll);
    }
  }


  async _onEmbededChange(event){
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    let path = event.target.name.split(/\.(.+)/)
    let name=path[1];
    let value=event.target.value;
    let actor=this.actor;
    let item = actor.data.items.find(i => i._id === path[0]);
    let update={_id:item._id,[name]:value};
    const updated = await actor.updateEmbeddedEntity("OwnedItem",update);
    
  }

  async _onEquipClick(event){
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));
    const actor = this.actor;
    let name = 'data.equipped.value';
    let value = (item.data.data.equipped.value) ? false : true; 

    let update = { _id: item._id, [name]: value };
    const updated = await actor.updateEmbeddedEntity("OwnedItem", update);
  }
  async _onContainerClick(event){
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));
    const actor = this.actor;
    let name = 'data.container.value';
    let value;
    switch (item.data.data.container.value){
      case 'carried':
        value='packed';
        break;
      case 'packed':
        value = 'none';
        break;
      default:
        value='carried'
        break;
    }

    let update = { _id: item._id, [name]: value };
    const updated = await actor.updateEmbeddedEntity("OwnedItem", update);
  }
}

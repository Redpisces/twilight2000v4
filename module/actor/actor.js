/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class twilightActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    const dietypes={"A":12,"B":10,"C":8,"D":6,"F":0};
    for (let [akey, attribute] of Object.entries(data.attributes)){
      attribute.die=dietypes[attribute.rating];
      for (let [skey, skill] of Object.entries(attribute.skills)){
        skill.die=dietypes[skill.rating];
      }
    }

  }

}

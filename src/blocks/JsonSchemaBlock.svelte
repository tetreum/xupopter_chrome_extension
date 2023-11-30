<script>
  export let recipe;
  export let block;
  export let inspector;
  export let selectedBlockId;

  let selectValue;
  let schemaList = [];

  function getSelectedBlock () {
    return recipe.blocks.find(block => block.id === selectedBlockId);
  }

  function getTypes () {
    document.querySelectorAll('[type="application/ld+json"]').forEach(el => {
      const json = JSON.parse(el.innerText);
      if (json['@type'] && !(schemaList.includes(json['@type']))) {
        schemaList.push(json['@type']);
      }
    });
  }

  function onSelect () {
    block.details.type = selectValue;
  }

  function onBlockSelected (isSelected) {
    if (isSelected) {
      getTypes();
    }
  }

  $: onBlockSelected(selectedBlockId == block.id);

  // if its a new block, get all possible types
  if (!block.details.type) {
    getTypes();
  }
</script>
<div class="text-center">
    <div class="mb-1">
        <strong>schema - </strong>
        <select class="form-select w-auto d-inline-block py-1" bind:value={selectValue} on:change={onSelect}>
            <option value="">Select an option</option>
            {#each schemaList as schemaType}
                <option value="{schemaType}">{schemaType}</option>
            {/each}
        </select>
    </div>
    <div class="text-muted">{block.details.type ? block.details.type : ''}</div>
</div>

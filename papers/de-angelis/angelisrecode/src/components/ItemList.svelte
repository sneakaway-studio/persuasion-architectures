<script>
  //acepting data:
  export let options = [];
</script>

<!-- TODO: 1. integrate bootstrap for list grids -->
<div class="table-body">
  {#each options as opt (opt.text, opt.id)}
    <!-- TODO (LP): 1. create checkbox component -->
    <div class="checkbox-item">
      <input type="checkbox" id={`item` + opt.id} />
      <label for={`item` + opt.id}>{opt.text}</label>
    </div>
  {/each}
</div>

<style>
  /* Styling the table body (blue part) */
  .table-body {
    background-color: #d5eaf6; /* Light blue */
    padding: 20px;
    border-radius: 0 0 10px 10px;
  }

  /* Style for checkbox items */
  .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #333;
  }

  .checkbox-item input[type="checkbox"]:checked {
    background-color: #6d519b; /* Purple color for checked boxes */
    border-color: #6d519b;
  }

  .checkbox-item label {
    font-size: 16px;
    color: #333;
  }
</style>

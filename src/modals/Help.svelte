<script>
  import Dialog, { Header, Title, Content } from "@smui/dialog";
  import IconButton from "@smui/icon-button";

  export let open = false;
</script>

<Dialog
  bind:open
  fullscreen
  aria-labelledby="fullscreen-title"
  aria-describedby="fullscreen-content"
>
  <Header>
    <Title id="fullscreen-title">Help</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <h3>Getting Started</h3>
    <p>left is filter, middle some vis, right publications...</p>

    <h3>Filtering</h3>
    <p>TODO</p>
  </Content>
</Dialog>

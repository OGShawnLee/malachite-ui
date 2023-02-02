<script>
  import { Switch, SwitchDescription, SwitchGroup, SwitchLabel  } from '$lib'
</script>

<SwitchGroup>
  <SwitchLabel>
    Lorem ipsum dolor sit.
  </SwitchLabel>
  <SwitchDescription class="sr-only">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur tenetur nisi. Autem aperiam sapiente tempore quibusdam esse reiciendis? Modi deleniti sequi nihil doloremque itaque ipsum obcaecati debitis? Aspernatur, animi?
  </SwitchDescription>
  <Switch let:isChecked>
    Toggle {isChecked}
  </Switch>
</SwitchGroup>
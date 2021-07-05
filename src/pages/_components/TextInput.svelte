<label>
  <input {...$$restProps} placeholder=" " />
  <div><slot /></div>
</label>

<style>
  label {
    line-height: 300%;
    position: relative;
  }
  input,
  div {
    display: flex;
    font-size: 1.25em;
  }
  div {
    position: absolute;
    top: 1.125em;
    left: 0.875em;
    padding: 0 0.5em;
    line-height: normal;
    transition: color 0.15s, transform 0.15s;
    transform-origin: top left;
    user-select: none;
  }
  input {
    contain: size;
    width: 100%;
    padding: 0.6875em 0.9375em;
    margin: 0.375em;
    color: rgb(var(--text-color));
    background: rgb(var(--background-color));
    border-radius: 0.25em;
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    transition: border-color 0.15s, box-shadow 0.15s;
    z-index: 1;
  }
  input:hover,
  input:focus {
    box-shadow: 0 0.0625rem 0.375rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  input:focus {
    padding: 0.625em 0.875em;
    border-width: 0.125em;
    border-color: rgb(var(--link-color));
    outline: none;
  }
  input:focus + div {
    color: rgb(var(--link-color));
  }
  input:focus + div,
  input:not(:placeholder-shown) + div {
    background: rgb(var(--background-color));
    transform: translateY(-1.1875em) scale(0.666);
  }
</style>

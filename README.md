# ComponentComms

Is a class that can be used to pass events between disconnected 
components. 

For example: If you have a front-end component that nests another 
component utilises a slot and anothter component you want to put in 
that slot. You pass ComponentComms object to both the slotted 
component and the component that has the slot, then both components 
dispatch events and listen for events the other compontent has 
dispatched.

> __Note:__ I only have real experience with [Lit](https://lit.dev/)
>           and [Vue](https://vuejs.org/) and pure JS Web Components.

> __Note also:__ While `ComponentComms` was initially built for
>           front-end components it could just as easily work for
>           code with no UI.

## A vue example

> __Note:__ The following example is much too simple to fully
>           demonstrate the power of ComponentComms and would
>           actually be much better implmeneted using Vue's built in
>           event system but it serve to ilistrate how
>           `ComponentComms` could work.
>           A much better example can be found in
>           [`vue-file-select`](https://github.com/evanwills/vue-file-select)
>           although (at the moment) it still uses the original
>           implementation of `ComponentComms`
>           ([`FileSelectCommunicator`](https://github.com/evanwills/vue-file-select/blob/master/src/components/FileSelect/logic/FileSelectCommunicator.class.js))

### Login component (slotted component)

```javascript
<template>
  <div v-if="loading">Logging in. Please wait.</div>
  <div v-else>
    <ul>
      <li>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </li>
      <li>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </li>
    </ul>
    <div v-if="loginError !== ''">{{ loginError }}</div>
    <button type="button" v-on:click="login">Login</button>
  </div>
</template>
<script setup>
import { defineModel, onBeforeMount, onBeforeUnmount, ref } from 'vue'
const props = defineProps({
  comms: { type: Object, required: true },
});

const username = defineModel();
const password = defineModel();
const init = ref(false);
const constroller = ref(new AbortController());
const loginError = ref('');
const loading = ref(false);

const login = async () => {
  if (loading.value === false) {    
    props.comms.dispatch('loading', true);
    loading.value = true;

    fetch(
      'https://www.example.com/login',
      {
        signal: controller.signal,
        method: 'POST',
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }).then((resposne) => {
          props.comms.dispatch('loading', false);
          props.comms.dispatch('closemodal', true);
          props.comms.dispatch('username', username.value);
          controller.value = null;
          loading.value = false;
        }).catch((error) => {
          loading.value = false;
          controller.value = null;
          props.comms.dispatch('loading', false);

          if (err.name === 'AbortError') {
            console.warn('login canceled');
          } else {
            console.error('Login error:', error);
            loginError.value = error;
          }

        })
      }
    )
  }
};

const handleClose = () => {
  if (controller.value !== null) {
    console.log('cancel login');
    controller.value.abort();
    controller.value = null;
  }
};

onBeforeMount(() => {
  if (init.value === false) {
    init.value = true;
    props.comms.addListener('close', 'login', handleClose);
  }
});
onBeforeUnmount(() => {
  props.comms.removeListener('close', 'login');
});
</script>
```

### Modal component

```javascript
<template>
<dialog ref="modal">
  <header v-if="heading !== ''"><h2>{{ heading }}</h2></header>
  <slot><div v-if="body !== ''">{{ body }}</div></slot>
  <button type="button" v-on:click="closeModal">Close</button>
</template>

<script setup>
import { defineModel, onBeforeMount, ref } from 'vue'
const props = defineProps({
  body: { type: String, required: false, default: '' },
  comms: { type: Object, required: true },
  heading: { type: String, required: false, default: '' },
  open: { type: Boolean, required: false, default: false },
});

const modal = ref(null);
const init = ref(false);

const justClose = () => {
  if (modal.value !== null && modal.value.open === true) {
    modal.value.close()
  }
}

const closeModal = () => {
  justClose();
  props.comms.dispatch('close', true);
};

const openModal = () => {
  if (modal.value !== null && modal.value.open !== true) {
    modal.value.showModal();
  }
};

watch(
  () => props.open,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (newVal === true) {
        openModal();
      } else {
        closeModal();
      }
    }
  }
);

onBeforeMount(() => {
  if (init.value === false) {
    init.value = true;
    if (props.open === true) {
      openModal();
    }
    props.comms.addListener('closemodal', 'modal', justClose);
  }
})

onBeforeUnmount(() => {
  props.comms.removeListener('closemodal', 'modal');
});
</script>
```

### Login/logout button

```javascript
<template>
  <span v-if="username !== ''">Hi {{ username }}</span>
  <button type="button" v-on:click="loginLogout">{{ btnTxt }}</button>
  <ModalComponent v-bind:comms="comms" heading="Login" v-bind:open="showLogin">
    <LoginForm v-bind:comms="comms" />
  </ModalComponent>
</template>
<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  loginName: { type: String, required: false, default: '' },
})

const comms = ref(new ComponentComms());
const init = ref(false);
const showLogin = ref(false);
const username = ref(props.loginName);

const btnTxt = computed(() => {
  return (username.value === '')
    ? 'Login'
    : 'Logout';
});

const setUsername = (username) => {
  username.value = username;
};

const loginLogout = () => {
  if (showLogin.value = false) {
    showLogin.value = true;
  } else {
    username.value = '';
  }
};

watch(
  () => props.loginName,
  (newName, oldName) => {
    if (oldName !== newName) {
      userName = newName;
    }
  }
)

onBeforeMount(() => {
  if (init.value === false) {
    init.value = true;
    if (props.open === true) {
      openModal();
    }
    props.comms.addListener('loggedin', 'login-btn', justClose);
  }
})
</script>
```

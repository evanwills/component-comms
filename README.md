# ComponentComms

* [Introduction](#introduction)
* [A Vue example](#a-vue-example)
  * [Login component (slotted)](#login-component-slotted-component)
  * [Modal component (with slot)](#modal-component-with-slot)
  * [Login/logout button](#loginlogout-button)
* [Listener call order](#listener-call-order)
* [Logging mode](#loggging-mode)
* [Public methods](#public-methods)
  * [`addListener()`](#addlistener)
  * [`dispatch()`](#dispatch)
  * [`removeListener()`](#removelistener)
  * [`removeListenersById()`](#removelistenersbyid)
  * [`enableLogging()`](#enablelogging)
  * [`disableLogging()`](#disablelogging)
  * [`getLogs()`](#getlogs)
  * [`clearLogs()`](#clearlogs)

## Introduction

`ComponentComms` is a class that can be used to pass events between 
disconnected components. 

For example: If you have a front-end component that nests another 
component utilises a slot and anothter component you want to put in 
that slot. You pass `ComponentComms` object to both the slotted 
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
>           demonstrate the power of ComponentComms. It would
>           actually be much better implmeneted using Vue's built
>           in event system but it serves to ilistrate how
>           `ComponentComms` could work.
>
> A much better example can be found in
> [`vue-file-select`](https://github.com/evanwills/vue-file-select)
>  although (at the moment) it still uses the original implementation
> of `ComponentComms`
>  ([`FileSelectCommunicator`](https://github.com/evanwills/vue-file-select/blob/master/src/components/FileSelect/logic/FileSelectCommunicator.class.js))

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

### Modal component (with slot)

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

## Listener call order

When an event is dispatched all the listeners registered for that 
event are called in the order that they were registered in. 

It is very risky to rely on listeners for a particular event being 
called in a particular order. It could lead to weird race condition 
errors.

If you need listeners to be called in a specific order, it's better 
to have a listener dispatch a different event so that new event can 
be listened for called in the expected order.

## Loggging mode

By default `ComponentComms` doesn't do any logging. It just 
dispatches events as you would expect. However, (particularly in 
development), it useful to see where and when events are being 
dispatched and where they are listened for.

By enabling logging either when instantiating `ComponentComms` or
later via [`enableLogging()`](#enablelogging) you can see console
logs of each event that is dispatched along with the data (if any)
that was dispatched with the event, which component dispatched the 
event (if supplied) and which listeners were called when the event 
was dispatched.

## Public methods

### `addListener()`

Add a new event listener for the current context.

#### Parameters

* `event` - `string` or `Array<string>`
  If event is an array of strings, the listener will be registered
  for each event listed in the array. Otherwise the listener will be
  registered for the single event supplied.

* `id` - `string`
  ID for the component registering the event.

* `listener` - callback `function`
  Call back function that takes one argument (`data`) and is called 
  any time a matching `event` is dispatched.

* `replace` (optional) - `boolean` [default: `false`]
  Whether or not to replace the existing listener with an alternative
  listener.
  > __Note:__ By default `addListener()` will emit a console error if 
  >           an a listener is already assigned to an `event`/`id`
  >           pair and the listener will not be replaced.

#### Sample code

```javascript
import { ComponentComms } from `component-comms`;
const comms = new ComponentComms();

let isClicked = false;

const handleClicked = () => {
  isClicked = !isClicked
}

// ... do some stuff
comms.addListeners('click', 'button', handleClicked);
```

### `dispatch()`

Dispatch an event (and possibly some data) to any listeners assigned 
to that event.

> __Note:__ Do not rely on listeners being called in a specific 
>           order. See [Listener call order](#listener-call-order) 
>           for more info.

#### Parameters

* `event` - `string`
  Name of the event being dispatched
* `data` (optional) - `any`
  Whatever data should be shared for that event
* `src` (optional) - `string`
  Name of the component that dispatched the event. 
  (Only useful when `ComponentComms` is in [logging mode](#loggging-mode))

#### Sample code

```javascript
// Logging not enabled
const soSomething = (action, comms) => {
  const event = (action === true)
    ? 'enabled'
    : 'disabled'

  comms.dispatch(event, action, 'doSomething()');
};
```

```javascript
// With logging enabled
const soSomething = (action, comms) => {
  const event = (action === true)
    ? 'enabled'
    : 'disabled'

  comms.dispatch(event, action, 'doSomething()');
};

// If `action` === true
// console group: 
//     ComponentComms.dispatch("enabled") - doSomething()
//       SOURCE: doSomething()
//       event: enabled
//       data: true
//       dispatched to: [[list of IDs]]
```

### `disableLogging()`

Turn off dispatch logging (if it's already turned on).

See [Logging mode](#loggging-mode) for more details on loggging.

> __Note:__ I'm not sure why this would be useful but it was very 
>           easy to implement so...

#### Sample code

```javascript
import { ComponentComms } from `component-comms`;
const comms = new ComponentComms(true);
// ... do some stuff
comms.disableLogging();
```

### `enableLogging()`

(Does not accept any parameters)

Turn on dispatch logging (if it's not already turned on)

See [Logging mode](#loggging-mode) for more details on loggging.

> __Note:__ It's easier (and recommended) to instantiate 
>           `ComponentComms` with logging enabled.

```javascript
import { ComponentComms } from `component-comms`;
const comms = new ComponentComms();
comms.enableLogging();
```

### `removeListener()`

Remove a known listener from the list of listener

#### Parameters

* `event` - `string`
  Name of the event the listener was assigned to

* `id` - `string`
  ID for the component registering the event.

#### Returns 

`boolean` - `TRUE` if the listener was removed. `FALSE` otherwise.

### `removeListenersById()`

If you are unmounting a component you should remove all listeners. 
If you have multiple listeners registered for that component you may 
not always remember to remove all listeners. `removeListenersById()` 
allows you to remove listeners for every event associated with the 
supplied ID.

#### Parameters

* `id` - `string`
  ID for the component that registered listeners.

#### Returns 

`number` - The total number of listerns that were removed.

### `getLogs()`

#### Parameters

* `event` - `string`
  Type of event that triggered the dispatch call
* `limit` - `number` (Default is `10`)
  Number of log entries that should be returned
* lastFirst - `boolean` (Default: false)
  Whether or not logs should be returned ordered newest to oldest or 
  oldest to newest

#### Returns

A list of log entries filtered on event type (if event was not an empty string)

### `clearLogs()`

Delete any log entries stored in the `ComponentComms` object.

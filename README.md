# izi-ioc

# beans.js

```javascript

    // Good practice - common enum to avoid string typos
    
    export default {
        TodoController: "TodoController",
        TodoStorage: "TodoStorage"
    }
```

# TodoStorage.js

```javascript

    import {inject, init} from "izi-ioc";

    export class TodoStorage {
        
        constructor() {
            this.items = [];
        }
        
        add(todo) {
            this.items.push(todo);
        }
    }
```

# TodoController.js

```javascript

    import {beans} from "./beans";
    import {inject, init} from "izi-ioc";
    
    export class TodoController {
        
        todoStorage = inject(beans.TodoStorage)
        
        @init
        init() {
            this.todoStorage.load();
        }
        
        add(todo) {
            this.todoStorage.add(todo);
        }

    }
```
    
# app.js

```javascript

    import beans from "./beans";
    import {bakeBeans, singletonOf} from "izi-ioc";
    import TodoController from "./TodoController";
    import TodoStorage from "./TodoStorage";
    
    const context = bakeBeans(
        singletonOf(TodoController).as(beans.TodoController),
        singletonOf(TodoStorage).as(beans.TodoStorage)
    );
    
    const controller = context.getBean(beans.TodoController);
    controller.add({title: "First Item To Do!"});
```

# izi-ioc

# bean.js

```javascript

    // Good practice - common enum to avoid string typos
    
    export default var bean = {
        TodoController: "TodoController",
        TodoStorage: "TodoStorage"
    }
```

# TodoStorage.js

```javascript

    export default class TodoStorage {
        constructor() {
            this.items = [];
        }
        
        add(todo) {
            this.items.push(todo);
        }
        
        load() {
            this.add({
                title: "Prepare documentation"
            });
        }
    }
```

# TodoController.js

```javascript

    import bean from "./bean";
    import {inject, init} from "izi-ioc";
    
    export default class TodoController {
        
        todoStorage = inject(bean.TodoStorage);
        
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

    import bean from "./bean";
    import {bakeBeans, singletonOf} from "izi-ioc";
    import TodoController from "./TodoController";
    import TodoStorage from "./TodoStorage";
    
    context = bakeBeans(
        singletonOf(TodoController).as(bean.TodoController),
        singletonOf(TodoStorage).as(bean.TodoStorage)
    );
```

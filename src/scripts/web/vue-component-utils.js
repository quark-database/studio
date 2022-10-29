// import {createApp, defineComponent} from "vue";
//
// export function mountNewComponent(options) {
//     const componentClassName = options.component;
//     const properties = options.properties;
//     const mountingTarget = options.to;
//
//     componentDefinition = defineComponent({
//         extends: componentClassName,
//         data: () => ({params: properties}),
//         created: function() {
//             // componentInstance = this.$root
//         }
//     });
//
//     createApp(componentDefinition).mount(container);
//
//     const component = defineComponent({
//         extends: componentClassName,
//         // propsData: properties
//         setup: () => {
//             return properties
//         }
//     })
//
//     const wrapper = document.createElement('div');
//     mountingTarget.appendChild(wrapper);
//     createApp(component).mount(wrapper);
//
//     return component
// }
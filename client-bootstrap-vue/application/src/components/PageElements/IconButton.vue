<template>
    <b-icon :icon="iconName" :variant="iconColor" v-b-hover="handleIconHover" @mousedown="handleIconClick"></b-icon>
</template>

<script>
export default {
    data: function() {return {
        iconClicked: false,
        iconColor: 'primary',
        iconName: 'plus-circle',
    };},
    methods: {
        handleIconHover: function(isHovered) {
            this.iconName = isHovered || this.iconClicked ? this.activeIconName : this.inactiveIconName;
        },
        handleIconClick: function() {
            this.iconClicked = true;
            this.iconColor = this.activeColorName;
            this.$emit('button-push');
            const changeIconBack = () => {
                this.iconColor = this.inactiveColorName;
                this.iconClicked = false;
                this.iconName = this.inactiveIconName;
                window.removeEventListener('mouseup', changeIconBack);
            };
            window.addEventListener('mouseup', changeIconBack);
        },
    },
    mounted: function() {
        this.iconColor = this.inactiveColorName;
        this.iconName = this.inactiveIconName;
    },
    props: {
        activeColorName: {
            type: String,
            default: 'secondary', // @see https://bootstrap-vue.org/docs/reference/color-variants
        },
        activeIconName: {
            type: String,
            default: 'plus-circle-fill', // @see https://icons.getbootstrap.com/
        },
        inactiveColorName: {
            type: String,
            default: 'primary', // @see https://bootstrap-vue.org/docs/reference/color-variants
        },
        inactiveIconName: {
            type: String,
            default: 'plus-circle', // @see https://icons.getbootstrap.com/
        },
    },
}
</script>

<style>
</style>
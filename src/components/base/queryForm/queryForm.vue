<template>
    <div class="c-query-form">
        <slot></slot>
        <div class="btn g-parent-clear">
            <Button type="primary">
                <Icon type="search"></Icon>
                查询
            </Button>
        </div>
    </div>
</template>

<script>
import './styles/queryForm.style';
export default {
    name: "QueryForm"
}
</script>
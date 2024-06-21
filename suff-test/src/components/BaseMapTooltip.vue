<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
    type: string;
    iri?: string;
}>();

const emit = defineEmits(["deselect"]);

function deselect() {
    emit("deselect");
}

function onEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
        deselect();
    }
}

onMounted(() => {
    document.addEventListener("keyup", onEscape);
});

onUnmounted(() => {
    document.removeEventListener("keyup", onEscape);
});
</script>

<template>
    <div class="overlay-content">
        <div class="title">
            <span><slot name="title"></slot></span>
            <button class="map-tooltip-close-btn" title="Close" @click="deselect">x</button>
        </div>
        <div class="type">{{ props.type }}</div>
        <div v-if="props.iri">IRI: <span class="metadata">{{ props.iri }}</span></div>
        <div class="metadata">
            <slot name="metadata"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
$arrow-size: 8px;

.overlay-content {
    background-color: white;
    border: 1px solid #cccccc;
    padding: 12px;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: $arrow-size; // offset arrow height
    width: 400px;

    .title {
        font-weight: bold;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        a {
            color: #0284c7;

            &:hover {
                color: #0ea5e9;
            }
        }

        button.map-tooltip-close-btn {
            color: grey;
            padding: 4px 6px;
            font-size: 0.8rem;
            width: unset;

            &:hover {
                color: black;
            }
        }
    }

    .type {
        font-size: 0.9rem;
        color: grey;
        font-style: italic;
        font-weight: normal;
        margin-top: -8px;
    }

    .metadata {
        font-family: monospace;
        background-color: #f0f0f0;
        padding: 4px;
    }

    &::after {
        content: " ";
        position: absolute;
        top: calc(100% - 1px - $arrow-size); // covers border, offset arrow height
        left: 50%;
        margin-left: -$arrow-size;
        border-width: $arrow-size;
        border-style: solid;
        border-color: white transparent transparent transparent;
    }
}
</style>
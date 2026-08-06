<script setup lang="ts">
import { Editor } from "@kurrawongai/kai-ui";

const props = defineProps<{
    modelValue?: any;
}>();

const emit = defineEmits<{
    "update:modelValue": [modelValue: any];
}>();

const colorMode = useColorMode();

function handleChange(input: string) {
    try {
        const data = JSON.parse(input);
        emit("update:modelValue", data);
    }
    catch (e) {

    }
}
</script>

<template>
    <div>
        <Tabs defaultValue="input">
            <TabsList>
                <TabsTrigger value="input">
                    Input Data
                </TabsTrigger>
                <TabsTrigger value="output">
                    Output Data
                </TabsTrigger>
            </TabsList>
            <TabsContent value="input">
                <Editor
                    :modelValue="JSON.stringify(props.modelValue, null, 4)"
                    language="json"
                    :theme="colorMode.value as ('light' | 'dark' | 'system')"
                    hideLanguage
                    hideTheme
                    @update:model-value="handleChange"
                />
            </TabsContent>
            <TabsContent value="output">
                <Editor :theme="colorMode.value as ('light' | 'dark' | 'system')" hideTheme readonly />
            </TabsContent>
        </Tabs>
    </div>
</template>

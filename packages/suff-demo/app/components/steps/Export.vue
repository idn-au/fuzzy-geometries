<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";
</script>

<template>
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Format <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
        <Button>
            Export
        </Button>
    </div>
</template>

<style scoped>

</style>

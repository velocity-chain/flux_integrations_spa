<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Edit Integration</h1>
      </v-col>
    </v-row>

    <v-row v-if="isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="integration">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <AutoSaveField
              :model-value="integration.name"
              label="Name *"
              :rules="[rules.required, rules.namePattern]"
              hint="No whitespace, max 40 characters"
              :on-save="(value: string | number) => updateField('name', String(value))"
              automation-id="integration-edit-name-input"
            />

            <AutoSaveField
              :model-value="integration.description || ''"
              label="Description"
              :rules="[rules.descriptionPattern]"
              hint="Max 255 characters, no tabs or newlines"
              :on-save="(value: string | number) => updateField('description', String(value))"
              class="mt-4"
              textarea
              :rows="3"
              automation-id="integration-edit-description-input"
            />

            <AutoSaveSelect
              :model-value="integration.status || 'active'"
              label="Status"
              :items="statusOptions"
              :on-save="(value: string) => updateField('status', value)"
              class="mt-4"
              automation-id="integration-edit-status-select"
            />

            <v-divider class="my-6" />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatDate(integration.created.at_time)"
                  label="Created"
                  readonly
                  variant="outlined"
                  density="compact"
                />
                <v-text-field
                  :model-value="integration.created.by_user"
                  label="Created By"
                  readonly
                  variant="outlined"
                  density="compact"
                  class="mt-2"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatDate(integration.saved.at_time)"
                  label="Last Saved"
                  readonly
                  variant="outlined"
                  density="compact"
                />
                <v-text-field
                  :model-value="integration.saved.by_user"
                  label="Last Saved By"
                  readonly
                  variant="outlined"
                  density="compact"
                  class="mt-2"
                />
              </v-col>
            </v-row>

            <v-card-actions class="px-0 mt-4">
              <v-btn 
                @click="router.push('/integrations')" 
                variant="text"
                data-automation-id="integration-edit-back-button"
              >
                Back to List
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar :model-value="showError as unknown as boolean" color="error" :timeout="5000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
/**
 * Integration Edit Page - Showcase of spa_utils AutoSave components
 * 
 * This page demonstrates how easy it is to build an edit page with:
 * - Auto-save on blur (no save button needed!)
 * - Built-in validation rules
 * - Loading/saving/error states
 * - Date formatting utilities
 * - Error handling
 * 
 * All from spa_utils components and utilities!
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/api/client'
// 🎯 All these utilities come from spa_utils - ready to use!
import { AutoSaveField, AutoSaveSelect, validationRules, formatDate, useErrorHandler } from '@velocity-chain/flux_spa_utils'
import type { IntegrationUpdate } from '@/api/types'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const integrationId = computed(() => route.params.id as string)

const { data: integration, isLoading, error: queryError } = useQuery({
  queryKey: ['integration', integrationId],
  queryFn: () => api.getIntegration(integrationId.value),
})

const errorRef = ref<Error | null>(null)
watch(queryError, (err) => {
  errorRef.value = err
}, { immediate: true })

const { showError, errorMessage } = useErrorHandler(errorRef as any)

const statusOptions = ['active', 'archived']

// 🎯 Use validation rules from spa_utils - no need to write your own!
const rules = {
  required: validationRules.required,
  namePattern: validationRules.namePattern,
  descriptionPattern: validationRules.descriptionPattern,
}

const { mutateAsync: updateIntegration } = useMutation({
  mutationFn: (data: IntegrationUpdate) => api.updateIntegration(integrationId.value, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['integration', integrationId.value] })
    queryClient.invalidateQueries({ queryKey: ['integrations'] })
    errorRef.value = null
  },
  onError: (error: Error) => {
    errorRef.value = error
  },
})

async function updateField(field: keyof IntegrationUpdate, value: string) {
  try {
    await updateIntegration({ [field]: value })
  } catch (error) {
    throw error
  }
}
</script>
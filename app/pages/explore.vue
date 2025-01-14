<script setup lang="ts">

const { data: page } = await useAsyncData('explore', () => queryContent('/explore').findOne())
if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
	title: page.value.title,
	ogTitle: page.value.title,
	description: page.value.description,
	ogDescription: page.value.description
})
</script>

<template>
	<UContainer>
		<div>
			<h2 class="text-3xl font-fancy mb-2">{{ page.title }}</h2>
			<p class="text-gray-600 mb-6">{{ page.description }}</p>

			<div 
				v-for="(section, index) in page.sections" 
				:key="section.title"
				data-aos="fade-up"
				:data-aos-delay="index * 100"
			>
				<a
					:href="section.url"
					rel="noopener noreferrer"
					target="_blank"
				>
					<div :class="[
						'p-8 rounded-2xl mb-5 transition-colors duration-300',
						`bg-${section.color}-100/30 hover:bg-${section.color}-100/40`
					]">
						<div class="flex items-center">
							<h6 :class="[
								'text-xl mb-1 mr-1',
								`text-${section.color}-800`
							]">
								{{ section.title }}
								<span v-if="section.status">({{ section.status }})</span>
							</h6>
							<span>
								<iconify-icon :icon="section.icon" />
							</span>
						</div>
						<p class="m-0">{{ section.description }}</p>
					</div>
				</a>
			</div>

			<div class="my-8"></div>

			<component
				v-for="comp in page.components"
				:key="comp.id"
				:is="comp.type"
				:id="comp.id"
				:class="comp.class"
				:data-aos="comp.animation"
			/>
		</div>
	</UContainer>
</template>

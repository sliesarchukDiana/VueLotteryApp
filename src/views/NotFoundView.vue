<template>
  <div class="not-found card-custom text-center">
    <h2>404 - Сторінка не знайдена</h2>
    <p>Схоже, ви перейшли за невірним посиланням.</p>
    <RouterLink to="/" class="btn-primary" style="display: inline-block; text-decoration: none; margin-top: 15px;">
      Повернутися на головну
    </RouterLink>
  </div>
</template>

<style scoped>
.text-center { text-align: center; padding: 3rem 1rem; }
</style>
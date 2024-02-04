'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex  flex-col items-center  justify-center">
      <h2 className="text-center">
        Something went wrong!
        {error.message}
      </h2>
      <button
        className="mt-4 rounded-md bg-sigSurface px-4 py-2 text-sm text-white transition-colors hover:bg-main"
        onClick={
          // Попытка восстановления путем повторной визуализации сегментов маршрута аутентификации
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  )
}

// Файл error.tsx можно использовать для определения границы пользовательского интерфейса для сегмента маршрута. Он служит защитой от непредвиденных ошибок и позволяет отображать пользователям резервный пользовательский интерфейс.

// В приведенном выше коде вы заметите несколько особенностей:

// «использовать клиент» — error.tsx должен быть клиентским компонентом.
// Он принимает два реквизита:
// ошибка: этот объект является экземпляром собственного объекта Error JavaScript.
// сброс: это функция для сброса границы ошибки. При выполнении функция попытается повторно отрисовать сегмент маршрута.

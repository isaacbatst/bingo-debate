"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Sparkles } from "lucide-react"
import { FRASES } from "./data"

export default function DebateBingo() {
  const [cartela, setCartela] = useState<string[]>([])
  const [marcadas, setMarcadas] = useState<boolean[]>(Array(25).fill(false))
  const [venceu, setVenceu] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)

  // Adicione este estilo no início do componente, após os imports
  const styles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  @media (max-width: 480px) {
    .line-clamp-3 {
      -webkit-line-clamp: 2;
    }
  }
`

  // Gerar cartela aleatória
  const gerarCartela = () => {
    const frasesEmbaralhadas = [...FRASES].sort(() => Math.random() - 0.5)
    const novaCartela = frasesEmbaralhadas.slice(0, 25)
    setCartela(novaCartela)
    setMarcadas(Array(25).fill(false))
    setVenceu(false)
    setPontuacao(0)
  }

  // Verificar vitória
  const verificarVitoria = (novasMarcadas: boolean[]) => {
    // Verificar linhas
    for (let i = 0; i < 5; i++) {
      if (novasMarcadas.slice(i * 5, i * 5 + 5).every(Boolean)) return true
    }

    // Verificar colunas
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((row) => novasMarcadas[row * 5 + i])) return true
    }

    // Verificar diagonais
    if ([0, 6, 12, 18, 24].every((i) => novasMarcadas[i])) return true
    if ([4, 8, 12, 16, 20].every((i) => novasMarcadas[i])) return true

    // Verificar cartela cheia
    if (novasMarcadas.every(Boolean)) return true

    return false
  }

  // Marcar/desmarcar célula
  const toggleCelula = (index: number) => {
    if (venceu) return

    const novasMarcadas = [...marcadas]
    novasMarcadas[index] = !novasMarcadas[index]
    setMarcadas(novasMarcadas)

    const novaPontuacao = novasMarcadas.filter(Boolean).length
    setPontuacao(novaPontuacao)

    if (verificarVitoria(novasMarcadas)) {
      setVenceu(true)
    }
  }

  // Gerar cartela inicial
  useEffect(() => {
    gerarCartela()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
            BINGO DO DEBATE
            <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Marque as frases conforme aparecem no debate!</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Badge variant="secondary" className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2">
            Marcadas: {pontuacao}/25
          </Badge>
          <Button onClick={gerarCartela} variant="outline" className="gap-2 text-sm sm:text-base">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            Nova Cartela
          </Button>
        </div>

        {/* Bingo Grid */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {cartela.map((frase, index) => (
                <button
                  key={index}
                  onClick={() => toggleCelula(index)}
                  className={`
                    aspect-square p-1 sm:p-2 rounded-md sm:rounded-lg border-2 transition-all duration-300 
                    text-[8px] xs:text-[9px] sm:text-xs font-medium
                    flex items-center justify-center text-center leading-tight
                    overflow-hidden relative group
                    ${
                      marcadas[index]
                        ? "bg-green-500 border-green-400 text-white shadow-lg transform scale-105"
                        : "bg-white/90 border-gray-300 text-gray-800 hover:bg-white hover:border-blue-400 hover:shadow-md"
                    }
                    ${venceu ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  disabled={venceu}
                  title={frase} // Tooltip para ver frase completa
                >
                  <span className="sm:line-clamp-4 hyphens-auto text-center w-full">
                    {frase}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vitória */}
        {venceu && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 animate-pulse">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                BINGO!
                <Trophy className="w-8 h-8" />
              </CardTitle>
              <div className="text-white text-lg">🎉 Parabéns! Você completou o bingo! 🎉</div>
              <div className="text-white/90">Pontuação final: {pontuacao}/25 células marcadas</div>
            </CardHeader>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-6 bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Como Jogar</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-center space-y-2">
            <p>• Clique nas células quando ouvir as frases durante o debate</p>
            <p>• Vença completando uma linha, coluna, diagonal ou cartela inteira</p>
            <p>• Use o botão "Nova Cartela" para embaralhar as frases</p>
            <p>• Edite o array FRASES_DEBATE no código para personalizar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

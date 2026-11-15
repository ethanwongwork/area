// Area Serif 0.81 round 3: CoreText renders of named glyphs, for comparing overlap glyphs on Apple's rasteriser.
// swift ct_render.swift FONT OUT.png SIZE_PX WGHT(0 = none) NAME...
import Foundation
import CoreText
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let url = URL(fileURLWithPath: a[1])
let out = URL(fileURLWithPath: a[2])
let size = CGFloat(Double(a[3])!)
let wght = Double(a[4])!
let names = Array(a[5...])
let descs = CTFontManagerCreateFontDescriptorsFromURL(url as CFURL) as! [CTFontDescriptor]
var desc = descs[0]
if wght > 0 {
    let tag: Int = 0x77676874
    let attrs: [CFString: Any] = [kCTFontVariationAttribute: [tag: wght]]
    desc = CTFontDescriptorCreateCopyWithAttributes(desc, attrs as CFDictionary)
}
let font = CTFontCreateWithFontDescriptor(desc, size, nil)
let cell = Int(ceil(size * 1.3))
let W = cell * names.count, H = cell
let cs = CGColorSpaceCreateDeviceGray()
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W, space: cs, bitmapInfo: CGImageAlphaInfo.none.rawValue)!
ctx.setFillColor(gray: 1, alpha: 1)
ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
ctx.setFillColor(gray: 0, alpha: 1)
ctx.setShouldAntialias(true)
ctx.setShouldSmoothFonts(false)
for (i, n) in names.enumerated() {
    var g = CTFontGetGlyphWithName(font, n as CFString)
    var p = CGPoint(x: CGFloat(i * cell) + size * 0.1, y: size * 0.3)
    CTFontDrawGlyphs(font, &g, &p, 1, ctx)
}
let img = ctx.makeImage()!
let dest = CGImageDestinationCreateWithURL(out as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, img, nil)
CGImageDestinationFinalize(dest)
